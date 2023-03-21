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
                if (isNaN(selectedParcel.resources[resourceName]) || selectedParcel.resources[resourceName] < cost) {
                    canAfford = false;
                    break;
                }
            }

            if (canAfford) {
                if (parcels.addBuildingToParcel(selectedParcelIndex, selectedBuildingId)) {
                    for (const [resourceName, cost] of resourceCost) {
                        selectedParcel.resources[resourceName] -= cost;
                    }

                    // Update resources when a kiln is built
                    if (selectedBuildingId === "kiln" && !selectedParcel.resources.coal) {
                        selectedParcel.resources = { coal: 0, ...selectedParcel.resources };
                    }

                    // Update resources when an ironSmelter is built
                    if (selectedBuildingId === "ironSmelter" && !selectedParcel.resources.ironOre) {
                        const [firstResourceKey, ...otherResourceKeys] = Object.keys(selectedParcel.resources);
                        const firstResourceValue = selectedParcel.resources[firstResourceKey];
                        selectedParcel.resources = {
                            [firstResourceKey]: firstResourceValue,
                            ironOre: 0,
                            ...otherResourceKeys.reduce((obj, key) => {
                                obj[key] = selectedParcel.resources[key];
                                return obj;
                            }, {}),
                        };
                    }

                    //ui.updateResourceDisplay(selectedParcel);
                    ui.updateBuildingDisplay(selectedParcel);

                    const totalBuildings = Object.values(selectedParcel.buildings).reduce((a, b) => a + b, 0);
                    //ui.updateParcelBuildingCount(selectedParcelIndex, totalBuildings);
                }
            }
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
        if (selectedParcel.resources[resourceName] < cost) {
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
