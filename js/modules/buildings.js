/*
Okay great. Next requirements are:
Unlock ironSmelter when bricks are > 0
Unlock ironMiner, stoneMiner & coalMiner when ironPlates are > 0
Unlock copperMiner & copperSmelter when ironMiner, stoneMiner & coalMiner all have been built at least once
Unlock gearPress when copperPlates are > 0
Unlock cableExtruder when gears are > 0
Unlock greenChipFactory when copperCables are > 0
Unlock redScienceLab when greenChips are > 0
Unlock researchCenter when redScience are > 0
*/

  const buildings = [
    {
      id: "kiln",
      name: "Kiln",
      cost: { stone: 25 },
      inputs: { stone: 2, coal: 1 },
      outputs: { bricks: 1 },
      rate: 1,
      minable: false,
    },
    {
      id: "ironSmelter",
      name: "Iron Smelter",
      cost: { bricks: 20},
      inputs: { ironOre: 2, coal: 1 },
      outputs: { ironPlates: 1 },
      rate: 1,
      minable: false,
    },
    {
      id: "copperSmelter",
      name: "Copper Smelter",
      cost: { bricks: 20 },
      inputs: { copperOre: 2, coal: 1 },
      outputs: { copperPlates: 1 },
      rate: 1,
      minable: false,
    },
    {
      id: "ironMiner",
      name: "Iron Miner",
      cost: { ironPlates: 25, bricks: 20 },
      inputs: {},
      outputs: { ironOre: 1 },
      rate: 1,
      minable: true,
    },
    {
      id: "coalMiner",
      name: "Coal Miner",
      cost: { ironPlates: 25, bricks: 20 },
      inputs: {},
      outputs: { coal: 1 },
      rate: 1,
      minable: true,
    },
    {
      id: "copperMiner",
      name: "Copper Miner",
      cost: { ironPlates: 25, bricks: 20 },
      inputs: {},
      outputs: { copperOre: 1 },
      rate: 1,
      minable: true,
    },
    {
      id: "stoneMiner",
      name: "Stone Miner",
      cost: { ironPlates: 25, bricks: 20 },
      inputs: {},
      outputs: { stone: 1 },
      rate: 1,
      minable: true,
    },
    {
      id: "gearPress",
      name: "Gear Press",
      cost: { ironPlates: 100, bricks: 200 },
      inputs: { ironPlates: 2 },
      outputs: { gears: 1 },
      rate: 1,
      minable: false,
    },
    {
      id: "cableExtruder",
      name: "Cable Extruder",
      cost: { gears: 50, bricks: 200 },
      inputs: { copperPlates: 1 },
      outputs: { copperCables: 2 },
      rate: 1,
      minable: false,
    },
    {
      id: "greenChipFactory",
      name: "Green Chip Factory",
      cost: { copperCables: 200, ironPlates: 200, bricks: 400 },
      inputs: { copperCables: 3, ironPlates: 2 },
      outputs: { greenChips: 1 },
      rate: 1,
      minable: false,
    },
    {
      id: "researchCenter",
      name: "Research Center",
      cost: { greenChips: 150, copperCables: 200, ironPlates: 200, bricks: 400 },
      inputs: { redScience: 1 },
      outputs: { researchPoints: 1 },
      rate: 1,
      minable: false,
    },
    {
      id: "redScienceLab",
      name: "Red Science Laboratory",
      cost: { greenChips: 250, copperCables: 250, gears: 250, bricks: 250 },
      inputs: { gears: 1, greenChips: 1 },
      outputs: { redScience: 1 },
      rate: 1,
      minable: false,
    },
    {
      id: "forwardBelt",
      name: "Forward Conveyor Belt",
      cost: { ironPlates: 250, gears: 50, greenChips: 25 },
      inputs: {},
      outputs: {},
      rate: 1,
      minable: false,
    },
    {
      id: "backwardBelt",
      name: "Backward Conveyor Belt",
      cost: { ironPlates: 250, gears: 50, greenChips: 25 },
      inputs: {},
      outputs: {},
      rate: 1,
      minable: false,
    },
    {
      id: "expansionCenter",
      name: "Expansion Center",
      cost: { ironPlates: 500, gears: 100, greenChips: 100 },
      inputs: {},
      outputs: {},
      rate: 1,
      minable: false,
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


  window.buildingManager = {
      getBuilding,
      getBuildingList,
      getBuildingByResourceName,
  };
