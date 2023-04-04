function calculatePollutionBuildingValue() {
  let pollutionOutput = 0;
  let pollutionReduction = 0;

  const buildingPollutionData = {
    coalPowerPlant: { pollutionOutput: 48, pollutionReduction: 0 },
    // Add other buildings with their pollution data
  };

  for (const parcel of window.parcels.parcelList) {
    for (const buildingType in parcel.buildings) {
      const building = buildingPollutionData[buildingType];
      if (building) {
        const count = parcel.buildings[buildingType];
        pollutionOutput += (building.pollutionOutput || 0) * count;
        pollutionReduction += (building.pollutionReduction || 0) * count;
      }
    }
  }

  gameState.pollution.pollutionBuildingValue = pollutionOutput - pollutionReduction;
}

function reduceBiterFactor() {
  const reductionAmount = 0.00002;

  if (gameState.pollution.pollutionBiterFactor > 0) {
    gameState.pollution.pollutionBiterFactor -= reductionAmount;

    // Ensure that the value doesn't go below 0
    if (gameState.pollution.pollutionBiterFactor < 0) {
      gameState.pollution.pollutionBiterFactor = 0;
    }
  }
}

function updatePollutionValues() {

  gameState.pollution.pollutionValue = (
    (isNaN(gameState.pollution.pollutionEnergyValue) ? 0 : gameState.pollution.pollutionEnergyValue) +
    (isNaN(gameState.pollution.pollutionBuildingValue) ? 0 : gameState.pollution.pollutionBuildingValue)
  );

  const pollutionValue = isNaN(gameState.pollution.pollutionValue) ? 0 : gameState.pollution.pollutionValue;
  const pollutionBiterFactor = isNaN(gameState.pollution.pollutionBiterFactor) ? 0 : gameState.pollution.pollutionBiterFactor;

  gameState.pollution.pollutionFactor = (
    ((1 / (1 + Math.exp(-40 * pollutionValue / 100000)) - 0.5) * 2) + pollutionBiterFactor
  );
}

function updatePollutionDisplay() {
  document.getElementById('total-pollution').textContent = (gameState.pollution.pollutionValue ?? 0).toFixed(0);
  document.getElementById('biter-factor').textContent = (gameState.pollution.pollutionBiterFactor ?? 0).toFixed(3);
  document.getElementById('pollution-factor').textContent = (gameState.pollution.pollutionFactor ?? 0).toFixed(3);
}
