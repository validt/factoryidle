  const buildings = [
    {
      id: "kiln",
      name: "Kiln",
      cost: { stone: 25 },
      inputs: { stone: 2, coal: 0.2 },
      outputs: { bricks: 1 },
      energyInput: 0,
      rate: 1,
      minable: false,
      productionRateModifier: 0,
      consumptionRateModifier: 0,
      productionModifierSources: {},
      consumptionModifierSources: {},
      unlockConditions: () => true,
    },
    {
      id: "ironSmelter",
      name: "Iron Smelter",
      cost: { bricks: 20},
      inputs: { ironOre: 2, coal: 0.2 },
      outputs: { ironPlates: 1 },
      energyInput: 0,
      rate: 1,
      minable: false,
      productionRateModifier: 0,
      consumptionRateModifier: 0,
      productionModifierSources: {},
      consumptionModifierSources: {},
      unlockConditions: () => window.gameState.parcels.some(parcel => parcel.resources.bricks > 0),
    },
    {
      id: "coalPowerPlant",
      name: "Coal Power Plant",
      cost: { bricks: 50 },
      inputs: { coal: 1 },
      outputs: {},
      energyOutput: 12,
      rate: 1,
      minable: false,
      productionRateModifier: 0,
      consumptionRateModifier: 0,
      productionModifierSources: {},
      consumptionModifierSources: {},
      unlockConditions: () => window.gameState.parcels.some(parcel => parcel.resources.ironPlates > 0),
    },
    {
      id: "coalMiner",
      name: "Coal Miner",
      cost: { ironPlates: 25, bricks: 20 },
      inputs: {},
      outputs: { coal: 1 },
      energyInput: 1,
      rate: 1,
      minable: true,
      productionRateModifier: 0,
      consumptionRateModifier: 0,
      productionModifierSources: {},
      consumptionModifierSources: {},
      unlockConditions: () =>
        window.gameState.parcels.some(parcel => parcel.resources.ironPlates > 0) &&
        window.gameState.parcels.some(parcel => parcel.buildings.coalPowerPlant > 0),
    },
    {
      id: "ironMiner",
      name: "Iron Miner",
      cost: { ironPlates: 25, bricks: 20 },
      inputs: {},
      outputs: { ironOre: 1 },
      energyInput: 1,
      rate: 1,
      minable: true,
      productionRateModifier: 0,
      consumptionRateModifier: 0,
      productionModifierSources: {},
      consumptionModifierSources: {},
      unlockConditions: () =>
        window.gameState.parcels.some(parcel => parcel.resources.ironPlates > 0) &&
        window.gameState.parcels.some(parcel => parcel.buildings.coalPowerPlant > 0),
    },
    {
      id: "stoneMiner",
      name: "Stone Miner",
      cost: { ironPlates: 25, bricks: 20 },
      inputs: {},
      outputs: { stone: 1 },
      energyInput: 1,
      rate: 1,
      minable: true,
      productionRateModifier: 0,
      consumptionRateModifier: 0,
      productionModifierSources: {},
      consumptionModifierSources: {},
      unlockConditions: () =>
        window.gameState.parcels.some(parcel => parcel.resources.ironPlates > 0) &&
        window.gameState.parcels.some(parcel => parcel.buildings.coalPowerPlant > 0),
    },
    {
      id: "copperMiner",
      name: "Copper Miner",
      cost: { ironPlates: 25, bricks: 20 },
      inputs: {},
      outputs: { copperOre: 1 },
      energyInput: 1,
      rate: 1,
      minable: true,
      productionRateModifier: 0,
      consumptionRateModifier: 0,
      productionModifierSources: {},
      consumptionModifierSources: {},
      unlockConditions: () =>
        window.gameState.parcels.some(parcel => parcel.buildings.ironMiner > 0) &&
        window.gameState.parcels.some(parcel => parcel.buildings.stoneMiner > 0) &&
        window.gameState.parcels.some(parcel => parcel.buildings.coalMiner > 0),
    },
    {
      id: "copperSmelter",
      name: "Copper Smelter",
      cost: { bricks: 20 },
      inputs: { copperOre: 2, coal: 0.2 },
      outputs: { copperPlates: 1 },
      energyInput: 0,
      rate: 1,
      minable: false,
      productionRateModifier: 0,
      consumptionRateModifier: 0,
      productionModifierSources: {},
      consumptionModifierSources: {},
      unlockConditions: () =>
        window.gameState.parcels.some(parcel => parcel.buildings.ironMiner > 0) &&
        window.gameState.parcels.some(parcel => parcel.buildings.stoneMiner > 0) &&
        window.gameState.parcels.some(parcel => parcel.buildings.coalMiner > 0),
    },
    {
      id: "gearPress",
      name: "Gear Press",
      cost: { ironPlates: 100, bricks: 200 },
      inputs: { ironPlates: 2 },
      outputs: { gears: 1 },
      energyInput: 2,
      rate: 1,
      minable: false,
      productionRateModifier: 0,
      consumptionRateModifier: 0,
      productionModifierSources: {},
      consumptionModifierSources: {},
      unlockConditions: () => window.gameState.parcels.some(parcel => parcel.resources.copperPlates > 0),
    },
    {
      id: "cableExtruder",
      name: "Cable Extruder",
      cost: { gears: 50, bricks: 200 },
      inputs: { copperPlates: 1 },
      outputs: { copperCables: 2 },
      energyInput: 2,
      rate: 1,
      minable: false,
      productionRateModifier: 0,
      consumptionRateModifier: 0,
      productionModifierSources: {},
      consumptionModifierSources: {},
      unlockConditions: () => window.gameState.parcels.some(parcel => parcel.resources.gears > 0),
    },
    {
      id: "greenChipFactory",
      name: "Green Chip Factory",
      cost: { copperCables: 200, gears: 200, bricks: 400 },
      inputs: { copperCables: 3, ironPlates: 2 },
      outputs: { greenChips: 1 },
      energyInput: 3,
      rate: 1,
      minable: false,
      productionRateModifier: 0,
      consumptionRateModifier: 0,
      productionModifierSources: {},
      consumptionModifierSources: {},
      unlockConditions: () => window.gameState.parcels.some(parcel => parcel.resources.copperCables > 0),
    },
    {
      id: "researchCenter",
      name: "Research Center",
      cost: { greenChips: 150, copperCables: 200, gears: 200, bricks: 400 },
      inputs: { redScience: 100 },
      outputs: { researchPoints: 1 },
      energyInput: 4,
      rate: 1,
      minable: false,
      productionRateModifier: 0,
      consumptionRateModifier: 0,
      productionModifierSources: {},
      consumptionModifierSources: {},
      unlockConditions: () => window.gameState.parcels.some(parcel => parcel.resources.greenChips > 0),
    },
    {
      id: "redScienceLab",
      name: "Red Science Laboratory",
      cost: { greenChips: 250, copperCables: 250, gears: 250, bricks: 250 },
      inputs: { gears: 4, greenChips: 4 },
      outputs: { redScience: 1 },
      energyInput: 3,
      rate: 1,
      minable: false,
      productionRateModifier: 0,
      consumptionRateModifier: 0,
      productionModifierSources: {},
      consumptionModifierSources: {},
      unlockConditions: () => window.gameState.parcels.some(parcel => parcel.buildings.researchCenter > 0),
    },
    {
      id: "forwardBelt",
      name: "Forward Conveyor Belt",
      cost: { expansionPoints: 1 },
      inputs: {},
      outputs: {},
      energyInput: 2,
      rate: 1,
      minable: false,
      productionRateModifier: 0,
      consumptionRateModifier: 0,
      productionModifierSources: {},
      consumptionModifierSources: {},
      unlockConditions: () => window.gameState.parcels.some(parcel => parcel.buildings.expansionCenter > 0),
    },
    {
      id: "backwardBelt",
      name: "Backward Conveyor Belt",
      cost: { expansionPoints: 1 },
      inputs: {},
      outputs: {},
      energyInput: 2,
      rate: 1,
      minable: false,
      productionRateModifier: 0,
      consumptionRateModifier: 0,
      productionModifierSources: {},
      consumptionModifierSources: {},
      unlockConditions: () => window.gameState.parcels.some(parcel => parcel.buildings.expansionCenter > 0),
    },
    {
      id: "expansionCenter",
      name: "Expansion Center",
      cost: { ironPlates: 100, expansionPoints: 4 },
      inputs: { redScience: 150 },
      outputs: { expansionPoints: 1 },
      energyInput: 3,
      rate: 1,
      minable: false,
      productionRateModifier: 0,
      consumptionRateModifier: 0,
      productionModifierSources: {},
      consumptionModifierSources: {},
      unlockConditions: () => window.gameState.research.expansionTech,
    },
    {
      id: "steelMill",
      name: "Steel Mill",
      cost: { ironPlates: 100, bricks: 400 },
      inputs: { ironPlates: 5 },
      outputs: { steel: 1 },
      energyInput: 3,
      rate: 1,
      minable: false,
      productionRateModifier: 0,
      consumptionRateModifier: 0,
      productionModifierSources: {},
      consumptionModifierSources: {},
      unlockConditions: () => window.gameState.research.steelMaking,
    },
  ];

  function getBuilding(id) {
    return buildings.find((building) => building.id === id);
  }

  function getBuildingList() {
      return buildings;
  }

  function getBuildingByResourceName(resourceName) {
      for (const building of buildings) { // Change this line to iterate over the buildings array
          if (building.outputs && building.outputs[resourceName]) { // Change this line to check for the resource name in the outputs object
              return building;
          }
      }
      return null;
  }

  function getTotalModifierValue(modifierSources) {
    let totalModifier = 0;
    for (const source in modifierSources) {
      totalModifier += modifierSources[source];
    }
    return totalModifier;
  }

  function updateBuildingProductionRateModifier(buildingId, modifierValue) {
    const building = getBuilding(buildingId);
    if (building) {
      building.productionRateModifier = modifierValue;
    }
  }

  function updateBuildingConsumptionRateModifier(buildingId, modifierValue) {
    const building = getBuilding(buildingId);
    if (building) {
      building.consumptionRateModifier = modifierValue;
    }
  }

  window.buildingManager = {
    getBuilding,
    getBuildingList,
    getBuildingByResourceName,
    updateBuildingProductionRateModifier,
    updateBuildingConsumptionRateModifier,
  };
