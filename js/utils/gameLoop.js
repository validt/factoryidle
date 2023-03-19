const gameLoop = (() => {
    let gameInterval;
    const tickRate = 1000;
    let tickCounter = 0;

    function start() {
        gameInterval = setInterval(() => {
            updateResources();
            updateBeltLogistics();
            ui.updateBuildingDropdown();
            ui.updateParcelsSectionVisibility();
            const selectedParcel = window.parcels.getParcel(window.ui.getSelectedParcelIndex());
            window.ui.updateResourceDisplay(selectedParcel);
            updateAllParcels();
            window.progressionManager.update(gameState);
            tickCounter++;

        }, tickRate);
    }

    function updateAllParcels() {
      // Iterate through all parcels
      for (const parcel of window.parcels.parcelList) {
        // Call updatePreviousResources method for each parcel
        parcel.updatePreviousResources();
      }
    }

    function updateResources() {
        // Iterate through all the parcels
        for (const parcel of window.parcels.parcelList) {
            // Iterate through each building type in the current parcel
            for (const buildingId in parcel.buildings) {
                const buildingCount = parcel.buildings[buildingId];

                // Check if there's at least one building of the current type
                if (buildingCount && buildingCount > 0) {
                    const building = window.buildingManager.getBuilding(buildingId);

                    // Check if the building has any input resources required for production
                    if (building.inputs) {
                        let canProduce = true;

                        // Check if the parcel has enough resources to meet the input requirements
                        for (const [key, value] of Object.entries(building.inputs)) {
                            if (!parcel.resources[key] || parcel.resources[key] < value * buildingCount) {
                                canProduce = false;
                                break;
                            }
                        }

                        // If the building can produce, consume the input resources and produce output resources
                        if (canProduce) {
                            for (const [key, value] of Object.entries(building.inputs)) {
                                parcel.resources[key] -= value * buildingCount * building.rate;
                            }

                            for (const [key, value] of Object.entries(building.outputs)) {
                                if (!parcel.resources[key]) {
                                    parcel.resources[key] = 0;
                                }
                                parcel.resources[key] += value * buildingCount * building.rate;
                            }
                        }
                    } else {
                        // If the building doesn't have any input resources, just produce the output resources
                        for (const [key, value] of Object.entries(building.outputs)) {
                            if (!parcel.resources[key]) {
                                parcel.resources[key] = 0;
                            }
                            parcel.resources[key] += value * buildingCount * building.rate;
                        }
                    }
                }
            }
        }

        // Update the resource display for the currently selected parcel
        const selectedParcel = parcels.getParcel(ui.getSelectedParcelIndex());
        ui.updateResourceDisplay(selectedParcel);
    }

    function updateBeltLogistics() {
      for (let i = 0; i < parcels.getParcelCount(); i++) {
        const currentParcel = parcels.getParcel(i);
        const nextParcelIndex = (i + 1) % parcels.getParcelCount();
        const previousParcelIndex = (i - 1 + parcels.getParcelCount()) % parcels.getParcelCount();
        const nextParcel = parcels.getParcel(nextParcelIndex);
        const previousParcel = parcels.getParcel(previousParcelIndex);

        for (const resourceName in currentParcel.resources) {
          if (currentParcel.inputValues && currentParcel.inputValues[resourceName]) {
            const forwardValue = currentParcel.inputValues[resourceName].forwardBelt || 0;
            const backwardValue = currentParcel.inputValues[resourceName].backwardBelt || 0;

            // Transfer resources using forward belts
            if (forwardValue > 0) {
              const availableResources = currentParcel.resources[resourceName];
              const transferAmount = Math.min(availableResources, forwardValue);
              currentParcel.resources[resourceName] -= transferAmount;
              nextParcel.resources[resourceName] = (nextParcel.resources[resourceName] || 0) + transferAmount;
            }

            // Transfer resources using backward belts
            if (backwardValue > 0) {
              const availableResources = currentParcel.resources[resourceName];
              const transferAmount = Math.min(availableResources, backwardValue);
              currentParcel.resources[resourceName] -= transferAmount;
              previousParcel.resources[resourceName] = (previousParcel.resources[resourceName] || 0) + transferAmount;
            }
          }
        }
      }
    }


    function stop() {
        clearInterval(gameInterval);
    }

    return {
        start,
        stop,
    };
})();

window.gameLoop = gameLoop;
