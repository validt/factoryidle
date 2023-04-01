document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    const intro = document.getElementById("intro");
    intro.style.display = "none";
  }, 6000);
});

document.addEventListener("DOMContentLoaded", () => {
    const buyParcelButton = document.getElementById("buyParcel");
    const buyBuildingButton = document.getElementById("buyBuilding");
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
        const highestParcelIndex = parcels.getParcelCount() - 1;
        const highestParcel = parcels.getParcel(highestParcelIndex);
        const highestParcelResource = highestParcel.resources.expansionPoints || 0;
        const resourceCount = highestParcelResource + buildingManager.getResourcesFromRemoteConstructionFacilities(window.parcels.parcelList, 'expansionPoints');

        if (parcels.canBuyParcel(resourceCount)) {
            const cost = parcels.buyParcelCost;

            if (highestParcel.resources.expansionPoints >= cost) {
                highestParcel.resources.expansionPoints -= cost;
            } else {
                const remainingCost = cost - highestParcelResource;
                highestParcel.resources.expansionPoints = 0;
                buildingManager.deductResourcesFromRemoteConstructionFacilities(window.parcels.parcelList, 'expansionPoints', remainingCost);
            }

            const newParcel = parcels.createNewParcel();
            ui.addParcelToUI(newParcel);
            ui.updateResourceDisplay(newParcel);

            // Select the newly bought parcel
            const newIndex = parcels.getParcelCount() - 1;
            ui.selectParcel(newIndex);
        }
    });
    // Buy Building button event listener
    buyBuildingButton.addEventListener("click", () => {
        const selectedParcelIndex = ui.getSelectedParcelIndex();
        const selectedBuildingId = buildingSelect.value;

        if (selectedParcelIndex !== null) {
            const selectedParcel = parcels.getParcel(selectedParcelIndex);

            // Call the buyBuilding function instead of repeating the code
            ui.buyBuilding(selectedParcel, selectedBuildingId);

            // Update the UI
            ui.updateBuildingDisplay(selectedParcel);

            const totalBuildings = Object.values(selectedParcel.buildings).reduce((a, b) => a + b, 0);
            //ui.updateParcelBuildingCount(selectedParcelIndex, totalBuildings);
        }
    });



    //Start Research button event listener
    startResearchButton.addEventListener("click", () => {
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
      }
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
  if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
  }
});

// Toggle dark mode and save the user's preference
darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});
