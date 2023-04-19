document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    const intro = document.getElementById("intro");
    intro.style.display = "none";
  }, 6000);
});

let accessibilityMode = false;

document.addEventListener("DOMContentLoaded", () => {
    const buyParcelButton = document.getElementById("buyParcel");
    const startResearchButton = document.getElementById("startResearch");
    const researchSelect = document.getElementById("researchSelect");

    let firstParcel;

    // Initialize the first parcel if parcels.parcelList is undefined or there's no parcel in the parcelList
    if (parcels.parcelList === undefined || parcels.parcelList.length === 0) {
      firstParcel = parcels.createNewParcel();
      ui.addParcelToUI(firstParcel);
    } else {
      firstParcel = parcels.parcelList[0];
    }

    // Select the first parcel
    const firstParcelTab = document.getElementById(`tab-${firstParcel.id}`);
    firstParcelTab.classList.add("selected");
    ui.updateResourceDisplay(firstParcel);

    // Buy Parcel button event listener
    buyParcelButton.addEventListener("click", () => {
      // Code used to look for highest parcel to pull resources from, now we pull from first parcel
      // const firstParcelIndex = parcels.getParcelCount() - 1; // old code
      const firstParcel = parcels.getParcel(0);
      const firstParcelResourceEP = firstParcel.resources.expansionPoints || 0;
      const firstParcelResourceAA = firstParcel.resources.alienArtefacts || 0;

      const selectedParcel = window.parcels.getParcel(ui.getSelectedParcelIndex());
      const selectedParcelHasRCF = selectedParcel.buildings.remoteConstructionFacility;

      const resourceCounts = {
        expansionPoints: firstParcelResourceEP + (selectedParcelHasRCF ? selectedParcel.resources.expansionPoints : 0) + buildingManager.getResourcesFromRemoteConstructionFacilities(window.parcels.parcelList, 'expansionPoints'),
        alienArtefacts: firstParcelResourceAA + (selectedParcelHasRCF ? selectedParcel.resources.alienArtefacts : 0) + buildingManager.getResourcesFromRemoteConstructionFacilities(window.parcels.parcelList, 'alienArtefacts'),
      };


      console.log("resourceCounts", resourceCounts);
      console.log("parcels.canBuyParcel(resourceCounts)", parcels.canBuyParcel(resourceCounts));
      if (parcels.canBuyParcel(resourceCounts)) {
        const cost = gameState.buyParcelCost;

        for (const [resource, amount] of Object.entries(cost)) {
          // Handle the case where firstParcel.resources[resource] is undefined
          firstParcel.resources[resource] = firstParcel.resources[resource] || 0;

          if (firstParcel.resources[resource] >= amount) {
            firstParcel.resources[resource] -= amount;
          } else {
            const remainingCost = amount - firstParcel.resources[resource];
            firstParcel.resources[resource] = 0;
            buildingManager.deductResourcesFromRemoteConstructionFacilities(window.parcels.parcelList, resource, remainingCost);
          }
        }

        const newParcel = parcels.createNewParcel();
        ui.addParcelToUI(newParcel);
        ui.updateResourceDisplay(newParcel);

        // Select the newly bought parcel
        const newIndex = parcels.getParcelCount() - 1;
        ui.selectParcel(newIndex);

        // Increment the costs for the next purchase
        gameState.buyParcelCost.expansionPoints = (gameState.buyParcelCost.expansionPoints + 0.7).toFixed(1);
        gameState.buyParcelCost.alienArtefacts = (gameState.buyParcelCost.alienArtefacts + 0.5).toFixed(1);
      } else {
        const missingResources = [
          {
            resourceName: "Expansion Points",
            amount: gameState.buyParcelCost.expansionPoints - resourceCounts.expansionPoints,
          },
          {
            resourceName: "Alien Artifacts",
            amount: gameState.buyParcelCost.alienArtefacts - resourceCounts.alienArtefacts,
          },
        ];

        const descriptionText = "To buy a parcel, your resources need to be in your first parcel (or a parcel with a Remote Construction Facility).";
        const timer = 10000; // 10 seconds

        ui.showMissingResourceOverlay(missingResources, event, descriptionText, timer);
      }
    });

    // Add tooltip to Buy Parcel button
    ui.addTooltipToBuyParcelButton(buyParcelButton);

    //Start Research button event listener
    startResearchButton.addEventListener("click", (event) => {
      const selectedResearchId = researchSelect.value;
      const selectedResearch = window.researchManager.getResearch(selectedResearchId);
      const resourceCost = Object.entries(selectedResearch.cost);

      const selectedParcel = gameState.parcels[ui.getSelectedParcelIndex()];

      let canAfford = true;
      for (const [resourceName, cost] of resourceCost) {
        const totalResource = (selectedParcel.resources[resourceName] || 0) + buildingManager.getResourcesFromRemoteConstructionFacilities(window.parcels.parcelList, resourceName);
        if (totalResource < cost) {
          canAfford = false;
          break;
        }
      }

      if (canAfford) {
        // Deduct the research cost
        for (const [resourceName, cost] of resourceCost) {
          if (selectedParcel.resources[resourceName] >= cost) {
            selectedParcel.resources[resourceName] -= cost;
          } else {
            const parcelResource = selectedParcel.resources[resourceName] || 0;
            const remainingResource = cost - parcelResource;
            selectedParcel.resources[resourceName] = 0;
            buildingManager.deductResourcesFromRemoteConstructionFacilities(window.parcels.parcelList, resourceName, remainingResource);
          }
        }

        // Perform the research (update gameState.research or any other relevant data)
        gameState.research[selectedResearchId] = true; // Mark the research as completed
        window.researchManager.completeResearch(selectedResearchId); // Add into research Manager as well as completed

        // Update the UI as needed
        window.researchManager.populateResearchDropdown();
        ui.updateParcelsSectionVisibility();
      } else {
        const missingResources = resourceCost
          .filter(([resourceName, cost]) => {
            const totalResource = (selectedParcel.resources[resourceName] || 0) + buildingManager.getResourcesFromRemoteConstructionFacilities(window.parcels.parcelList, resourceName);
            return totalResource < cost;
          })
          .map(([resourceName, cost]) => {
            const totalResource = (selectedParcel.resources[resourceName] || 0) + buildingManager.getResourcesFromRemoteConstructionFacilities(window.parcels.parcelList, resourceName);
            return { resourceName, amount: cost - totalResource };
          });

        ui.showMissingResourceOverlay(missingResources, event);
      }
    });

    // Add event listeners for the buttons
    document.getElementById('factoryOff').addEventListener('click', factoryOff);
    document.getElementById('factoryOn').addEventListener('click', factoryOn);

    // Event listener for Accessibility Mode
    const accessibilityModeToggle = document.getElementById("accessibility-mode-toggle");
    accessibilityModeToggle.addEventListener("click", () => {
      accessibilityMode = !accessibilityMode;
      accessibilityModeToggle.textContent = `Accessibility Mode: ${accessibilityMode ? "On" : "Off"}`;

      // Update the overlay behavior based on the accessibility mode
      updateOverlayBehavior();
    });

    gameLoop.start();
    researchManager.populateResearchDropdown();
    ui.updateParcelsSectionVisibility();
    //ui.populateBuildNewBuildingDropdown();
});

function saveGameWithAnimation() {
  const saveButton = document.getElementById('saveButton');
  const saveText = saveButton.querySelector('.save-text');
  const saveCheckmark = saveButton.querySelector('.save-checkmark');

  window.saveGame();

  saveText.style.transform = 'translateY(100%)';
  saveCheckmark.style.transform = 'translateY(0)';

  setTimeout(() => {
    saveText.style.transform = 'translateY(0)';
    saveCheckmark.style.transform = 'translateY(-100%)';
  }, 1000);
}

const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.querySelector('body');

// Check the user's preference when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  const darkMode = localStorage.getItem('darkMode');

  // Enable dark mode if the user has not set a preference or has set it to 'true'
  if (darkMode === null || darkMode === 'true') {
    body.classList.add('dark-mode');
  }

  // Save the user's preference to localStorage
  localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

// Toggle dark mode and save the user's preference
darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

// Factory Off function
function factoryOff() {
  for (const parcel of window.parcels.parcelList) {
    for (const buildingId in parcel.activeBuildings) {
      const buildingCount = parcel.activeBuildings[buildingId];
      for (let i = 0; i < buildingCount; i++) {
        ui.deactivateBuilding(parcel, buildingId);
      }
    }
  }
}

// Factory On function
function factoryOn() {
  for (const parcel of window.parcels.parcelList) {
    for (const buildingId in parcel.buildings) {
      const buildingCount = parcel.buildings[buildingId];
      for (let i = 0; i < buildingCount; i++) {
        ui.activateBuilding(parcel, buildingId);
      }
    }
  }
}
