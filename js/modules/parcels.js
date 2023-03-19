function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

function createNumberGuard(target) {
  return new Proxy(target, {
    set(obj, prop, value) {
      if (!isNumber(value)) {
        console.warn(`Attempted to set a non-number value (${value}) for property '${prop}'. Ignoring the operation.`);
        return true;
      }
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
            kiln: id === 'parcel-1' ? 6 : 0,
            ironSmelter: id === 'parcel-1' ? 10 : 0,
            coalMiner: id === 'parcel-1' ? 24 : 0,
            stoneMiner: id === 'parcel-1' ? 12 : 0,
            ironMiner: id === 'parcel-1' ? 20 : 0,
            copperSmelter: id === 'parcel-1' ? 6 : 0,
            copperMiner: id === 'parcel-1' ? 12 : 0,
            gearPress: id === 'parcel-1' ? 2 : 0,
            cableExtruder: id === 'parcel-1' ? 4 : 0,
            greenChipFactory: id === 'parcel-1' ? 2 : 0,
            redScienceLab: id === 'parcel-1' ? 2 : 0,
            researchCenter: id === 'parcel-1' ? 1 : 0,
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
    maxBuildingsPerParcel: 4,
    buyParcelCost: 50,
    upgradeCosts: {
      maxBuildingLimit: [
        {
          level: 1,
          cost: {
            stone: 50,
          },
          maxBuildingLimit: 4, // Add the max building limit value for this level
        },
        {
          level: 2,
          cost: {
            stone: 50,
          },
          maxBuildingLimit: 12, // Add the max building limit value for this level
        },
        {
          level: 3,
          cost: {
            ironOre: 100,
            stone: 100,
            coal: 50,
          },
          maxBuildingLimit: 25, // Add the max building limit value for this level
        },
        // ... Add more levels and costs as needed
      ],
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
