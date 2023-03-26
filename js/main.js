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

    // Initialize the first parcel
    const firstParcel = parcels.createNewParcel();
    ui.addParcelToUI(firstParcel);



    // Select the first parcel
    const firstParcelTab = document.getElementById(`tab-${firstParcel.id}`);
    firstParcelTab.classList.add("selected");
    ui.updateResourceDisplay(firstParcel);

    // Buy Parcel button event listener
    buyParcelButton.addEventListener("click", () => {
        const highestParcelIndex = parcels.getParcelCount() - 1;
        const highestParcel = parcels.getParcel(highestParcelIndex);
        const resourceCount = highestParcel.resources.expansionPoints;

        if (parcels.canBuyParcel(resourceCount)) {
            highestParcel.resources.expansionPoints -= parcels.buyParcelCost;
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
        const selectedBuilding = buildingManager.getBuilding(selectedBuildingId);
        const resourceCost = Object.entries(selectedBuilding.cost);

        if (selectedParcelIndex !== null) {
            const selectedParcel = parcels.getParcel(selectedParcelIndex);

            let canAfford = true;
            for (const [resourceName, cost] of resourceCost) {
                const totalResource = (selectedParcel.resources[resourceName] || 0) + getResourcesFromRemoteConstructionFacilities(parcels.parcelList, resourceName);
                if (totalResource < cost) {
                    canAfford = false;
                    break;
                }
            }


            if (canAfford) {
                if (parcels.addBuildingToParcel(selectedParcelIndex, selectedBuildingId)) {
                  for (const [resourceName, cost] of resourceCost) {
                      if (selectedParcel.resources[resourceName] >= cost) {
                          selectedParcel.resources[resourceName] -= cost;
                      } else {
                          const remainingResource = cost - selectedParcel.resources[resourceName];
                          selectedParcel.resources[resourceName] = 0;
                          deductResourcesFromRemoteConstructionFacilities(parcels.parcelList, resourceName, remainingResource);
                      }
                  }

                    // Initialize Output resources for any building
                    initializeResourceOutput(selectedParcel, selectedBuilding);

                    // Update resources when a kiln is built
                    if (selectedBuildingId === "kiln" && !selectedParcel.resources.coal) {
                        selectedParcel.resources = { coal: 0, ...selectedParcel.resources };
                    }

                    // Update resources when a ironSmelter is built
                    if (selectedBuildingId === "ironSmelter" && !selectedParcel.resources.ironOre) {
                        selectedParcel.resources = { ironOre: 0, ...selectedParcel.resources };
                    }

                    //ui.updateResourceDisplay(selectedParcel);
                    ui.updateBuildingDisplay(selectedParcel);

                    const totalBuildings = Object.values(selectedParcel.buildings).reduce((a, b) => a + b, 0);
                    //ui.updateParcelBuildingCount(selectedParcelIndex, totalBuildings);
                }
            }
        }
    });

    // Initializes resources for resource table (used in Buy Building event listener)
    function initializeResourceOutput(parcel, building) {
        for (const outputResource in building.outputs) {
            if (!parcel.resources.hasOwnProperty(outputResource)) {
                parcel.resources[outputResource] = 0;
            }
        }
    }


    //Remote Construction Facility Helper Functions
    function getResourcesFromRemoteConstructionFacilities(parcels, resourceName) {
        let totalResource = 0;
        console.log(parcels);
        console.log(resourceName);
        for (const parcel of parcels) {
            if (parcel.buildings.remoteConstructionFacility) {
                totalResource += parcel.resources[resourceName] || 0;
            }
        }
        console.log(totalResource);
        return totalResource;
    }

    function deductResourcesFromRemoteConstructionFacilities(parcels, resourceName, requiredResource) {
        for (const parcel of parcels) {
            if (parcel.buildings.remoteConstructionFacility) {
                const availableResource = parcel.resources[resourceName] || 0;
                const resourceToDeduct = Math.min(availableResource, requiredResource);
                parcel.resources[resourceName] -= resourceToDeduct;
                requiredResource -= resourceToDeduct;

                if (requiredResource <= 0) {
                    break;
                }
            }
        }
    }

    //Start Research button event listener
    startResearchButton.addEventListener("click", () => {
      const selectedResearchId = researchSelect.value;
      const selectedResearch = window.researchManager.getResearch(selectedResearchId);
      const resourceCost = Object.entries(selectedResearch.cost);

      const selectedParcel = gameState.parcels[ui.getSelectedParcelIndex()];

      let canAfford = true;
      for (const [resourceName, cost] of resourceCost) {
        const resourceAmount = selectedParcel.resources[resourceName];

        if (resourceAmount === undefined || isNaN(resourceAmount) || resourceAmount < cost) {
          canAfford = false;
          break;
        }
      }

      if (canAfford) {
        // Deduct the research cost
        for (const [resourceName, cost] of resourceCost) {
          selectedParcel.resources[resourceName] -= cost;
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
