const buildings = [
  {
    id: "kiln",
    name: "Kiln",
    category : "Basics",
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
    category : "Basics",
    cost: { bricks: 20 },
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
    category : "Energy",
    cost: { ironPlates: 25, bricks: 25 },
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
    category : "Basics",
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
    category : "Basics",
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
    category : "Basics",
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
    category : "Basics",
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
    category : "Basics",
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
    category : "Intermediates",
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
    category : "Intermediates",
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
    category : "Intermediates",
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
    category : "Progress & Expansion",
    cost: { greenChips: 150, copperCables: 200, gears: 200, bricks: 400 },
    inputs: {},
    outputs: {},
    description: "Unlocks Science Labs.",
    energyInput: 4,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.parcels.some(parcel => parcel.resources.greenChips > 0),
  },
  // {
  //   id: "forwardBelt",
  //   name: "Forward Conveyor Belt",
  //   cost: { expansionPoints: 1 },
  //   inputs: {},
  //   outputs: {},
  //   energyInput: 2,
  //   rate: 1,
  //   minable: false,
  //   productionRateModifier: 0,
  //   consumptionRateModifier: 0,
  //   productionModifierSources: {},
  //   consumptionModifierSources: {},
  //   unlockConditions: () => window.gameState.parcels.some(parcel => parcel.buildings.expansionCenter > 0),
  // },
  // {
  //   id: "backwardBelt",
  //   name: "Backward Conveyor Belt",
  //   cost: { expansionPoints: 1 },
  //   inputs: {},
  //   outputs: {},
  //   energyInput: 2,
  //   rate: 1,
  //   minable: false,
  //   productionRateModifier: 0,
  //   consumptionRateModifier: 0,
  //   productionModifierSources: {},
  //   consumptionModifierSources: {},
  //   unlockConditions: () => window.gameState.parcels.some(parcel => parcel.buildings.expansionCenter > 0),
  // },
  {
    id: "beltBus",
    name: "Belt Bus",
    category : "Progress & Expansion",
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
    category : "Progress & Expansion",
    cost: { ironPlates: 100, expansionPoints: 4 },
    inputs: { redScience: 60 },
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
    category : "Basics",
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
  {
    id: "oilWell",
    name: "Oil Well",
    category : "Basics",
    cost: { steel: 250, gears: 250, greenChips: 200 },
    inputs: {},
    outputs: { oilBarrel: 1 },
    energyInput: 2,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.oilProcessing,
  },
  {
    id: "oilRefinery",
    name: "Oil Refinery",
    category : "Basics",
    cost: { steel: 250, gears: 250, greenChips: 200 },
    inputs: { oilBarrel: 10 },
    outputs: { petroleumBarrel: 1 },
    energyInput: 3,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.parcels.some(parcel => parcel.buildings.oilWell > 0),
  },
  {
    id: "plasticsPlant",
    name: "Plastics Plant",
    category : "Intermediates",
    cost: { steel: 250, gears: 250, greenChips: 200 },
    inputs: { petroleumBarrel: 1, coal: 0.5 },
    outputs: { plastics: 3 },
    energyInput: 2,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.parcels.some(parcel => parcel.buildings.oilRefinery > 0),
  },
  {
    id: "sulfurPlant",
    name: "Sulfur Plant",
    category : "Intermediates",
    cost: { steel: 500, gears: 500, greenChips: 200 },
    inputs: { petroleumBarrel: 1 },
    outputs: { sulfur: 2 },
    energyInput: 2,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.parcels.some(parcel => parcel.buildings.oilRefinery > 0),
  },
  {
    id: "redChipFactory",
    name: "Red Chip Factory",
    category : "Intermediates",
    cost: { steel: 500, gears: 500, greenChips: 500 },
    inputs: { copperCables: 4, greenChips: 2, plastics: 2 },
    outputs: { redChips: 1 },
    energyInput: 6,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.advancedElectronics,
  },
  {
    id: "remoteConstructionFacility",
    name: "Remote Construction Facility",
    category : "Progress & Expansion",
    cost: { gears: 250, greenChips: 100 },
    inputs: {},
    outputs: {},
    energyInput: 6,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.remoteConstruction,
    description: "Spend resources from this parcel globally. -30% Production Rate. +30% Consumption Rate.",
  },
  {
    id: "speedBeaconT1",
    name: "Speed Beacon T1",
    category : "Beacons",
    cost: { steel: 100, redChips: 100 },
    inputs: {},
    outputs: {},
    energyInput: 3,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.beaconTech,
    description: "+2% Production Rate. +2.5% Consumption Rate.",
  },
  {
    id: "productivityBeaconT1",
    name: "Productivity Beacon T1",
    category : "Beacons",
    cost: { steel: 100, redChips: 100 },
    inputs: {},
    outputs: {},
    energyInput: 3,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.beaconTech,
    description: "+1% Production Rate. +0.5% Consumption Rate.",
  },
  {
    id: "speedBeaconT2",
    name: "Speed Beacon T2",
    category : "Beacons",
    cost: { steel: 1000, redChips: 1000 },
    inputs: {},
    outputs: {},
    energyInput: 6,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.beaconTech2,
    description: "+4% Production Rate. +5% Consumption Rate.",
  },
  {
    id: "productivityBeaconT2",
    name: "Productivity Beacon T2",
    category : "Beacons",
    cost: { steel: 1000, redChips: 1000 },
    inputs: {},
    outputs: {},
    energyInput: 6,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.beaconTech2,
    description: "+2% Production Rate. +1% Consumption Rate.",
  },
  {
    id: "speedBeaconT3",
    name: "Speed Beacon T3",
    category : "Beacons",
    cost: { steel: 10000, redChips: 10000 },
    inputs: {},
    outputs: {},
    energyInput: 9,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.beaconTech3,
    description: "+8% Production Rate. +10% Consumption Rate.",
  },
  {
    id: "productivityBeaconT3",
    name: "Productivity Beacon T3",
    category : "Beacons",
    cost: { steel: 10000, redChips: 10000 },
    inputs: {},
    outputs: {},
    energyInput: 9,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.beaconTech3,
    description: "+6% Production Rate. +3% Consumption Rate.",
  },
  {
    id: "blueprintLibrary",
    name: "Blueprint Library",
    category : "Progress & Expansion",
    cost: { steel: 2000, gears: 5000, redChips: 1000 },
    inputs: {},
    outputs: {},
    energyInput: 6,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.blueprintTech,
  },
  {
    id: "militaryHQ",
    name: "Military HQ",
    category : "Progress & Expansion",
    cost: { ironPlates: 1000, copperCables: 500 },
    inputs: {},
    outputs: {},
    energyInput: 6,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.militaryTech,
  },
  {
    id: "standardAmmunitionFactory",
    name: "Ammunition Factory (Standard)",
    category : "Progress & Expansion",
    cost: { ironPlates: 1000, gears: 500 },
    inputs: { ironPlates: 1, copperPlates: 3 },
    outputs: { standardAmmunition: 1 },
    energyInput: 6,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.militaryTech,
  },
  {
    id: "armorPenetratingAmmunitionFactory",
    name: "Ammunition Factory (Armor Pen)",
    category : "Progress & Expansion",
    cost: { steel: 1000, gears: 500, greenChips: 500 },
    inputs: { standardAmmunition: 5, steel: 1, copperPlates: 2 },
    outputs: { armorPenetratingAmmunition: 1 },
    energyInput: 12,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.militaryTech2,
  },
  {
    id: "piercingAmmunitionFactory",
    name: "Ammunition Factory (Piercing)",
    category : "Progress & Expansion",
    cost: { steel: 10000, gears: 10000, redChips: 5000 },
    inputs: { armorPenetratingAmmunition: 4, steel: 1, copperPlates: 1 },
    outputs: { piercingAmmunition: 1 },
    energyInput: 18,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.militaryTech3,
  },
  {
    id: "solarBatteryArray",
    name: "Solar & Battery Array",
    category : "Energy",
    cost: { steel: 100, copperCables: 100, greenChips: 50, battery: 50 },
    inputs: {},
    outputs: {},
    energyOutput: 4,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.solarTech,
  },
  {
    id: "trainStation",
    name: "Train Station",
    category : "Progress & Expansion",
    cost: { steel: 100, copperCables: 100, greenChips: 50},
    inputs: {},
    outputs: {},
    energyInput: 8,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.trains,
  },
  // {
  //   id: "electricStoneFurnace",
  //   name: "Stone Furnace (Electric)",
  //   cost: { steel: 500, bricks: 500, redChips: 250 },
  //   inputs: { stone: 4 },
  //   outputs: { bricks: 2 },
  //   energyInput: 6,
  //   rate: 1,
  //   minable: false,
  //   productionRateModifier: 0,
  //   consumptionRateModifier: 0,
  //   productionModifierSources: {},
  //   consumptionModifierSources: {},
  //   unlockConditions: () => true,
  // },
  // {
  //   id: "electricIronFurnace",
  //   name: "Iron Furnace (Electric)",
  //   cost: { steel: 500, bricks: 500, redChips: 250 },
  //   inputs: { ironOre: 4 },
  //   outputs: { ironPlates: 2 },
  //   energyInput: 6,
  //   rate: 1,
  //   minable: false,
  //   productionRateModifier: 0,
  //   consumptionRateModifier: 0,
  //   productionModifierSources: {},
  //   consumptionModifierSources: {},
  //   unlockConditions: () => true,
  // },
  // {
  //   id: "electricCopperFurnace",
  //   name: "Copper Furnace (Electric)",
  //   cost: { steel: 500, bricks: 500, redChips: 250 },
  //   inputs: { copperOre: 4},
  //   outputs: { copperPlates: 2 },
  //   energyInput: 6,
  //   rate: 1,
  //   minable: false,
  //   productionRateModifier: 0,
  //   consumptionRateModifier: 0,
  //   productionModifierSources: {},
  //   consumptionModifierSources: {},
  //   unlockConditions: () => true,
  // },
  {
    id: "pipeMill",
    name: "Pipe Mill",
    category : "Intermediates",
    cost: { steel: 150, bricks: 150 },
    inputs: { ironPlates: 1 },
    outputs: { pipe: 1 },
    energyInput: 3,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.advancedMaterialProcessing,
  },
  {
    id: "engineFactory",
    name: "Engine Factory",
    category : "Intermediates",
    cost: { steel: 150, bricks: 150 },
    inputs: { gears: 1, pipe: 2, steel: 1 },
    outputs: { engineUnit: 1 },
    energyInput: 4,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.basicEngineUnits,
  },
  {
    id: "rodFactory",
    name: "Rod Factory",
    category : "Intermediates",
    cost: { steel: 150, bricks: 150 },
    inputs: { ironPlates: 1 },
    outputs: { ironRod: 2 },
    energyInput: 4,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.advancedMaterialProcessing,
  },
  {
    id: "railFactory",
    name: "Rail Factory",
    category : "Intermediates",
    cost: { steel: 150, bricks: 150 },
    inputs: { stone: 1, steel: 1, ironRod: 1 },
    outputs: { rail: 5 },
    energyInput: 4,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.trains,
  },
  {
    id: "electricalEngineFactory",
    name: "Electrical Engine Factory",
    category : "Intermediates",
    cost: { steel: 150, bricks: 150 },
    inputs: { greenChips: 2, engineUnit: 1 },
    outputs: { electricalEngineUnits: 1 },
    energyInput: 6,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.advancedEngineUnits,
  },
  {
    id: "batteryFactory",
    name: "Battery Factory",
    category : "Intermediates",
    cost: { steel: 150, bricks: 150 },
    inputs: { ironPlates: 1, copperPlates: 1, sulfur: 1 },
    outputs: { battery: 1 },
    energyInput: 6,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.batteryTech,
  },
  {
    id: "fuelProcessingFacility",
    name: "Fuel Processing Facility",
    category : "Intermediates",
    cost: { steel: 150, bricks: 150 },
    inputs: { petroleumBarrel: 10, coal: 10 },
    outputs: { fuelCell: 1 },
    energyInput: 6,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.rocketTech,
  },
  {
    id: "LDSFactory",
    name: "LDS Factory",
    category : "Intermediates",
    cost: { steel: 150, bricks: 150 },
    inputs: { copperPlates: 20, plastics: 5, steel: 2 },
    outputs: { lightDensityStructures: 1 },
    energyInput: 6,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.rocketTech,
  },
  {
    id: "rocketControlUnitFactory",
    name: "Rocket Control Unit Factory",
    category : "Intermediates",
    cost: { steel: 150, bricks: 150 },
    inputs: { blueChips: 1, redChips: 5, greenChips: 5 },
    outputs: { lightDensityStructures: 1 },
    energyInput: 6,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.rocketTech,
  },
  {
    id: "blueChipFactory",
    name: "Blue Chip Factory",
    category : "Intermediates",
    cost: { steel: 150, bricks: 150 },
    inputs: { blueChips: 1, redChips: 5, greenChips: 5 },
    outputs: { lightDensityStructures: 1 },
    energyInput: 6,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.advancedElectronics2,
  },
  {
    id: "turretFactory",
    name: "Turret Factory",
    category : "Intermediates",
    cost: { steel: 150, bricks: 150 },
    inputs: { ironPlates: 150, gears: 50, copperCables: 50, bricks: 25 },
    outputs: { turret: 1 },
    energyInput: 6,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.militaryTech,
  },
  {
    id: "wallFactory",
    name: "Wall Factory",
    category : "Intermediates",
    cost: { steel: 150, bricks: 150 },
    inputs: { ironPlates: 5, bricks: 50 },
    outputs: { wall: 1 },
    energyInput: 6,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.militaryTech,
  },
  {
    id: "redScienceLab",
    name: "Red Science Laboratory",
    category : "Progress & Expansion",
    cost: { greenChips: 250, copperCables: 250, gears: 250, bricks: 250 },
    inputs: { copperPlates: 100, gears: 100 },
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
    id: "greenScienceLab",
    name: "Green Science Laboratory",
    category : "Progress & Expansion",
    cost: { greenChips: 250, copperCables: 250, gears: 250, bricks: 250 },
    inputs: { ironPlates: 200, gears: 200, greenChips: 100 },
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
    id: "darkScienceLab",
    name: "Dark Science Laboratory",
    category : "Progress & Expansion",
    cost: { greenChips: 250, copperCables: 250, gears: 250, bricks: 250 },
    inputs: { standardAmmunition: 300, turret: 2, wall: 5 },
    outputs: { darkScience: 1 },
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
    id: "blueScienceLab",
    name: "Blue Science Laboratory",
    category : "Progress & Expansion",
    cost: { greenChips: 250, copperCables: 250, gears: 250, bricks: 250 },
    inputs: { sulfur: 100, redChips: 300, engineUnit: 200 },
    outputs: { blueScience: 1 },
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
    id: "purpleScienceLab",
    name: "Purple Science Laboratory",
    category : "Progress & Expansion",
    cost: { greenChips: 250, copperCables: 250, gears: 250, bricks: 250 },
    inputs: { rails: 450, steel: 1000, redChips: 1000, greenChips: 500 },
    outputs: { purpleScience: 1 },
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
    id: "yellowScienceLab",
    name: "Yellow Science Laboratory",
    category : "Progress & Expansion",
    cost: { greenChips: 250, copperCables: 250, gears: 250, bricks: 250 },
    inputs: { blueChips: 200, greenChips: 300, battery: 200, electricalEngineUnits: 100 },
    outputs: { yellowScience: 1 },
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
    id: "rocketLaunchPad",
    name: "Rocket Launch Pad",
    category : "Progress & Expansion",
    cost: { greenChips: 250, copperCables: 250, gears: 250, bricks: 250 },
    inputs: { satelite: 1, rocketParts: 100 },
    outputs: { whiteScience: 100 },
    energyInput: 16,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.rocketTech,
  },
  {
    id: "rocketPartAssembly",
    name: "Rocket Part Assembly",
    category : "Progress & Expansion",
    cost: { greenChips: 250, copperCables: 250, gears: 250, bricks: 250 },
    inputs: { fuelCell: 1000, lightDensityStructures: 1000, rocketControlUnit: 1000 },
    outputs: { rocketParts: 1 },
    energyInput: 20,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.rocketTech,
  },
  {
    id: "sateliteAssembly",
    name: "Satelite Assembly",
    category : "Progress & Expansion",
    cost: { greenChips: 250, copperCables: 250, gears: 250, bricks: 250 },
    inputs: { battery: 5000, copperPlates: 4800, ironPlates: 1800, plastics: 5000, blueChips: 1000, fuelCell: 500, steel: 7000 },
    outputs: { satelite: 1 },
    energyInput: 20,
    rate: 1,
    minable: false,
    productionRateModifier: 0,
    consumptionRateModifier: 0,
    productionModifierSources: {},
    consumptionModifierSources: {},
    unlockConditions: () => window.gameState.research.rocketTech,
  },
];

const cateories = [
  {
    id: "1",
    name: "Energy"
  },
  {
    id: "2",
    name: "Basics"
  },
  {
    id: "3",
    name: "Intermediates"
  },
  {
    id: "4",
    name: "Progress & Expansion"
  },
  {
    id: "4",
    name: "Beacons"
  }
];


function getBuilding(id) {
  return buildings.find((building) => building.id === id);
}

function getBuildingList() {
  return buildings;
}

function getCateories() {
  return cateories;
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

// Initializes resources for resource table (used in Buy Building event listener)
function initializeResourceOutput(parcel, building) {
  for (const outputResource in building.outputs) {
    if (!parcel.resources.hasOwnProperty(outputResource)) {
      parcel.resources[outputResource] = 0;
    }
  }
}


// Remote Construction Facility Helper Functions
function getResourcesFromRemoteConstructionFacilities(parcelss, resourceName) {
  let totalResource = 0;
  for (const parcel of parcelss) {
    if (parcel.buildings.remoteConstructionFacility) {
      totalResource += parcel.resources[resourceName] || 0;
    }
  }

  // Get the selected parcel
  const selectedParcel = parcels.getParcel(ui.getSelectedParcelIndex());

  // Subtract resources from the selected parcel if it has a remote construction facility
  if (selectedParcel && selectedParcel.buildings.remoteConstructionFacility) {
    totalResource -= selectedParcel.resources[resourceName] || 0;
  }

  return totalResource;
}

function deductResourcesFromRemoteConstructionFacilities(parcels, resourceName, requiredResource) {
  console.log(requiredResource);
  for (const parcel of parcels) {
    if (parcel.buildings.remoteConstructionFacility) {
      if (isNaN(parcel.resources[resourceName]) || parcel.resources[resourceName] === undefined) {
        parcel.resources[resourceName] = 0;
      }

      const availableResource = parcel.resources[resourceName];
      console.log("availableResource", availableResource);
      console.log("requiredResource", requiredResource);
      const resourceToDeduct = Math.min(availableResource, requiredResource);
      parcel.resources[resourceName] -= resourceToDeduct;
      requiredResource -= resourceToDeduct;

      if (requiredResource <= 0) {
        break;
      }
    }
  }
}

/* Military Building Logic */
const AmmunitionTypeCatalogue = [
  { ammunitionType: "Standard", resourceId: "standardAmmunition" },
  { ammunitionType: "Armor Penetrating", resourceId: "armorPenetratingAmmunition" },
  { ammunitionType: "Piercing", resourceId: "piercingAmmunition" },
];

// Count the available ammunition from parcels with militaryHQ
function getAmmunitionFromMilitaryHQ(parcels, ammunitionType) {
  let totalAmmunition = 0;

  parcels.forEach((parcel) => {
    if (parcel.buildings["militaryHQ"]) {
      const resourceId = AmmunitionTypeCatalogue.find((ammo) => ammo.ammunitionType === ammunitionType)?.resourceId;
      totalAmmunition += parcel.resources[resourceId] || 0;
    }
  });

  return totalAmmunition;
}

// Deduct consumed ammunition from parcels with militaryHQ
function deductAmmunitionFromMilitaryHQ(parcels, ammunitionType, amount) {
  const resourceId = AmmunitionTypeCatalogue.find((ammo) => ammo.ammunitionType === ammunitionType)?.resourceId;

  parcels.forEach((parcel) => {
    if (parcel.buildings["militaryHQ"] && parcel.resources[resourceId]) {
      const deduction = Math.min(parcel.resources[resourceId], amount);
      parcel.resources[resourceId] -= deduction;
      amount -= deduction;
    }

    if (amount <= 0) {
      return;
    }
  });
}


// Add consumed ammunition to parcels with militaryHQ
function addAmmunitionToMilitaryHQ(parcels, ammunitionType, totalAmount) {
  const resourceId = AmmunitionTypeCatalogue.find((ammo) => ammo.ammunitionType === ammunitionType)?.resourceId;

  // Count the number of militaryHQ buildings
  const militaryHQCount = parcels.reduce((count, parcel) => {
    return count + (parcel.buildings["militaryHQ"] ? 1 : 0);
  }, 0);

  // Calculate the amount of ammunition to distribute to each militaryHQ
  const amountPerHQ = totalAmount / militaryHQCount;

  parcels.forEach((parcel) => {
    if (parcel.buildings["militaryHQ"]) {
      parcel.resources[resourceId] = (parcel.resources[resourceId] || 0) + amountPerHQ;
    }
  });
}


window.buildingManager = {
  getBuilding,
  getBuildingList,
  getCateories,
  getBuildingByResourceName,
  updateBuildingProductionRateModifier,
  updateBuildingConsumptionRateModifier,
  initializeResourceOutput,
  getResourcesFromRemoteConstructionFacilities,
  deductResourcesFromRemoteConstructionFacilities,
  getAmmunitionFromMilitaryHQ,
  deductAmmunitionFromMilitaryHQ,
  addAmmunitionToMilitaryHQ,
};
