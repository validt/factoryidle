const gameLoop = (() => {
    let gameInterval;
    const tickRate = 1000;
    let tickCounter = 0;

    function start() {
        window.loadGame();
        projects.renderProjects();
        ui.updateBuildingDisplay(window.parcels.getParcel(window.ui.getSelectedParcelIndex()));
        gameInterval = setInterval(() => {
            updateResources();
            updateBeltLogistics();
            ui.updateBuildingDropdown();
            ui.updateParcelsSectionVisibility();
            const selectedParcel = window.parcels.getParcel(window.ui.getSelectedParcelIndex());
            window.ui.updateResourceDisplay(selectedParcel);
            updateAllParcels();
            ui.updateEnergyDisplay();
            window.progressionManager.update(gameState);
            ui.updateSectionVisibility("energy-section", gameState.sectionVisibility.energySection);
            ui.updateSectionVisibility("project-section", gameState.sectionVisibility.projectSection);
            ui.updateSectionVisibility("research-section", gameState.sectionVisibility.researchSection);
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

                    const totalProductionRateModifier = calculateProductionRateModifier(parcel, building, buildingCount);
                    const totalConsumptionRateModifier = calculateConsumptionRateModifier(parcel, building, buildingCount);
                    // console.log(buildingId + ": totalConsumptionRateModifier: " + totalConsumptionRateModifier);

                    // Check if the building has any input resources required for production
                    if (building.inputs && !(building.energyOutput > 0)) { // Add !building.energyOutput to the condition
                        let canProduce = true;

                        // Check if the parcel has enough resources to meet the input requirements
                        for (const [key, value] of Object.entries(building.inputs)) {
                            if (!parcel.resources[key] || parcel.resources[key] < value * buildingCount * (1 + totalConsumptionRateModifier)) {
                                canProduce = false;
                                break;
                            }
                        }

                        // If the building can produce, consume the input resources and produce output resources
                        if (canProduce) {
                            for (const [key, value] of Object.entries(building.inputs)) {
                                const updatedValue = parcel.resources[key] - value * buildingCount * building.rate * (1 + totalConsumptionRateModifier);
                                parcel.resources[key] = Math.round(updatedValue * 10) / 10;
                            }

                            for (const [key, value] of Object.entries(building.outputs)) {
                                if (!parcel.resources[key]) {
                                    parcel.resources[key] = 0;
                                }
                                const updatedValue = parcel.resources[key] + value * buildingCount * building.rate * (1 + totalProductionRateModifier);
                                parcel.resources[key] = Math.round(updatedValue * 10) / 10;
                            }
                        }
                    } else {
                        for (const [key, value] of Object.entries(building.outputs)) {
                            if (!parcel.resources[key]) {
                                parcel.resources[key] = 0;
                            }
                            const updatedValue = parcel.resources[key] + value * buildingCount * building.rate * (1 + totalProductionRateModifier);
                            parcel.resources[key] = Math.round(updatedValue * 10) / 10;
                        }
                    }
                }
            }
        }

        // Update the resource display for the currently selected parcel
        const selectedParcel = parcels.getParcel(ui.getSelectedParcelIndex());
        ui.updateResourceDisplay(selectedParcel);
    }

    function calculateProductionRateModifier(parcel, building, buildingCount) {
        const buildingProductionRateModifier = parcel.buildingProductionRateModifiers[building.id] && parcel.buildingProductionRateModifiers[building.id].energyModifier || 0;
        const remoteConstructionFacilityModifier = (parcel.buildings.remoteConstructionFacility && parcel.buildings.remoteConstructionFacility > 0) ? 0.5 : 0;
        return Math.max(-1, parcels.getGlobalProductionRateModifier() + building.productionRateModifier + parcel.productionRateModifier + buildingProductionRateModifier - remoteConstructionFacilityModifier);
    }

    function calculateConsumptionRateModifier(parcel, building, buildingCount) {
        const buildingConsumptionRateModifier = parcel.buildingConsumptionRateModifiers[building.id] && parcel.buildingConsumptionRateModifiers[building.id].energyModifier || 0;
        const remoteConstructionFacilityModifier = (parcel.buildings.remoteConstructionFacility && parcel.buildings.remoteConstructionFacility > 0) ? 0.5 : 0;
        return Math.max(-1, parcels.getGlobalConsumptionRateModifier() + building.consumptionRateModifier + parcel.consumptionRateModifier + buildingConsumptionRateModifier - remoteConstructionFacilityModifier);
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
        calculateProductionRateModifier,
        calculateConsumptionRateModifier,
    };
})();

window.gameLoop = gameLoop;
