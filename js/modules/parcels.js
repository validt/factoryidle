function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

function createNumberGuard(target) {
  return new Proxy(target, {
    get(obj, prop) {
      const value = obj[prop];
      if (typeof value === 'object' && value !== null) {
        return createNumberGuard(value);
      }
      return value;
    },
    set(obj, prop, value) {
      if (!isNumber(value)) {
        console.warn(`Attempted to set a non-number value (${value}) for property '${prop}'. Ignoring the operation.`);
        return true;
      }
      value = Math.round(value * 10) / 10;
      obj[prop] = value;
      return true;
    },
  });
}

class Parcel {
    constructor(id, maxBuildings) {
        this.id = id;
        this.maxBuildings = maxBuildings;
        this.buildings = createNumberGuard({
            // kiln: id === 'parcel-1' ? 6 : 0,
            // ironSmelter: id === 'parcel-1' ? 10 : 0,
            // coalMiner: id === 'parcel-1' ? 24 : 0,
            // stoneMiner: id === 'parcel-1' ? 12 : 0,
            // ironMiner: id === 'parcel-1' ? 20 : 0,
            // copperSmelter: id === 'parcel-1' ? 6 : 0,
            // copperMiner: id === 'parcel-1' ? 12 : 0,
            // gearPress: id === 'parcel-1' ? 2 : 0,
            // cableExtruder: id === 'parcel-1' ? 4 : 0,
            // greenChipFactory: id === 'parcel-1' ? 2 : 0,
            // redScienceLab: id === 'parcel-1' ? 2 : 0,
            // researchCenter: id === 'parcel-1' ? 1 : 0,
            // coalPowerPlant: id === 'parcel-1' ? 0 : 0,
        });
        this.resources = createNumberGuard({
            stone: 0,
        });
        this.beltUsage = {
          forwards: 0,
          backwards: 0,
        };
        this.previousResources = createNumberGuard({
          coal: 0,
          stone: 0,
          ironOre: 0,
          copperOre: 0,
        });
        this.upgrades = {
          maxBuildingLimit: 1,
        };
        this.productionRateModifier = 0;
        this.consumptionRateModifier = 0;
        this.buildingProductionRateModifiers = {};
        this.buildingConsumptionRateModifiers = {};
        this.inputValues = {};
    }

    updatePreviousResources() {
      this.previousResources = { ...this.resources };
    }

    addBuilding(buildingType) {
        const totalBuildings = Object.values(this.buildings).reduce((a, b) => a + b, 0);
        if (totalBuildings < this.maxBuildings) {
            if (!this.buildings[buildingType]) {
                this.buildings[buildingType] = 0;
            }
            this.buildings[buildingType]++;
            return true;
        }
        return false;
    }

    calculateBeltUsage(column) {
      if (column === "forwards" || column === "backwards") {
        return this.beltUsage[column];
      } else {
        throw new Error(`Invalid belt usage column: ${column}`);
      }
    }

    setBeltUsage(column, value) {
      if (column === "forwards" || column === "backwards") {
        this.beltUsage[column] = value;
      } else {
        throw new Error(`Invalid belt usage column: ${column}`);
      }
    }

}

const parcels = {
    parcelList: [],
    maxBuildingsPerParcel: 8,
    buyParcelCost: 2,
    upgradeCosts: {
      maxBuildingLimit: [
        {
          level: 1,
          cost: {
            stone: 50,
          },
          maxBuildingLimit: 8, // Add the max building limit value for this level
        },
        {
          level: 2,
          cost: {
            expansionPoints: 1,
          },
          maxBuildingLimit: 16, // Add the max building limit value for this level
        },
        {
          level: 3,
          cost: {
            expansionPoints: 2,
          },
          maxBuildingLimit: 24, // Add the max building limit value for this level
        },
        {
          level: 4,
          cost: {
            expansionPoints: 4,
          },
          maxBuildingLimit: 32, // Add the max building limit value for this level
        },
        {
          level: 5,
          cost: {
            expansionPoints: 6,
          },
          maxBuildingLimit: 40, // Add the max building limit value for this level
        },
        {
          level: 6,
          cost: {
            expansionPoints: 8,
          },
          maxBuildingLimit: 48, // Add the max building limit value for this level
        },
        {
          level: 7,
          cost: {
            steel: 50,
            expansionPoints: 16,
          },
          maxBuildingLimit: 56, // Add the max building limit value for this level
        },
        {
          level: 8,
          cost: {
            steel: 100,
            expansionPoints: 32,
          },
          maxBuildingLimit: 64, // Add the max building limit value for this level
        },
        {
          level: 9,
          cost: {
            steel: 400,
            expansionPoints: 64,
          },
          maxBuildingLimit: 72, // Add the max building limit value for this level
        },
        {
          level: 10,
          cost: {
            steel: 1600,
            expansionPoints: 128,
          },
          maxBuildingLimit: 80, // Add the max building limit value for this level
        },
        {
          level: 11,
          cost: {
            steel: 3200,
            expansionPoints: 256,
          },
          maxBuildingLimit: 88, // Add the max building limit value for this level
        },
        {
          level: 12,
          cost: {
            steel: 6400,
            expansionPoints: 512,
          },
          maxBuildingLimit: 96, // Add the max building limit value for this level
        },
      ],
    },
    globalProductionRateModifiers: {
      energyModifier: 0,
      // Add more sources of modifiers here
    },
    globalConsumptionRateModifiers: {
      energyModifier: 0,
      // Add more sources of modifiers here
    },
    getGlobalProductionRateModifier: function () {
      return Object.values(this.globalProductionRateModifiers).reduce((a, b) => a + b, 0);
    },
    getGlobalConsumptionRateModifier: function () {
      return Object.values(this.globalConsumptionRateModifiers).reduce((a, b) => a + b, 0);
    },


    createNewParcel() {
        const parcel = new Parcel(`parcel-${this.parcelList.length + 1}`, this.maxBuildingsPerParcel);
        this.parcelList.push(parcel);
        return parcel;
    },

    canBuyParcel(resourceCount) {
        return resourceCount >= this.buyParcelCost;
    },

    addBuildingToParcel(parcelIndex, buildingType) {
        return this.parcelList[parcelIndex].addBuilding(buildingType);
    },

    getParcelCount() {
        return this.parcelList.length;
    },

    getParcel(parcelIndex) {
        return this.parcelList[parcelIndex];
    },

    getUpgradeInfo(parcel, upgradeType) {
        const currentLevel = parcel.upgrades[upgradeType];
        const upgradeInfo = this.upgradeCosts[upgradeType].find(
            (upgrade) => upgrade.level === currentLevel + 1
        );
        return upgradeInfo;
    },

    getUpgradeCost(parcel, upgradeType) {
      if (!parcel.upgrades[upgradeType]) {
        console.log(`Upgrade type '${upgradeType}' not found`);
        return null;
      }

      const currentLevel = parcel.upgrades[upgradeType];
      const nextLevelUpgrade = this.upgradeCosts[upgradeType].find(
        (upgrade) => upgrade.level === currentLevel + 1
      );

      return nextLevelUpgrade ? nextLevelUpgrade.cost : null;
    },

    upgradeParcel(parcel, upgradeType) {
      const upgradeCost = this.getUpgradeCost(parcel, upgradeType);

      if (!upgradeCost) {
        console.log("Max level reached");
        return;
      }

      const canAfford = Object.keys(upgradeCost).every((resource) => {
        return parcel.resources[resource] >= upgradeCost[resource];
      });

      if (!canAfford) {
        console.log("Not enough resources");
        return;
      }

      Object.keys(upgradeCost).forEach((resource) => {
        parcel.resources[resource] -= upgradeCost[resource];
      });

      // Find the upgrade info for the current level
      const upgradeInfo = this.upgradeCosts[upgradeType].find(
        (upgrade) => upgrade.level === parcel.upgrades[upgradeType] + 1
      );

      // Update the max building limit for the parcel
      if (upgradeInfo && upgradeInfo.maxBuildingLimit) {
        parcel.maxBuildings = upgradeInfo.maxBuildingLimit;
        ui.updateBuildingDisplay(parcel);
      }

      parcel.upgrades[upgradeType]++;
      console.log(`Upgraded ${upgradeType} to level ${parcel.upgrades[upgradeType]}`);
    },

};

window.parcels = parcels;
