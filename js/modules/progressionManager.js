class ProgressionManager {
  constructor() {
    this.unlockedBuildings = new Set();
  }

  // Check if the building is unlocked
  isUnlocked(buildingId) {
    return this.unlockedBuildings.has(buildingId);
  }

  // Unlock a building
  unlockBuilding(buildingId) {
    this.unlockedBuildings.add(buildingId);

    // Check if all required buildings are unlocked and update the Production header visibility
    if (
      this.isUnlocked("ironMiner") &&
      this.isUnlocked("stoneMiner") &&
      this.isUnlocked("coalMiner")
    ) {
      const productionHeader = document.getElementById(`productionHeader-${window.gameState.parcels[ui.getSelectedParcelIndex()].id}`);
      const countHeader = document.getElementById(`countHeader-${window.gameState.parcels[ui.getSelectedParcelIndex()].id}`);
      if (productionHeader) {
        countHeader.style.display = "";
        productionHeader.style.display = ""; // Unhide the Production header
      }
    }

  }

  // Check the requirements for a building
  checkRequirements(buildingId, gameState) {
    const parcels = gameState.parcels;
    const researchCompleted = gameState.research;

    // Check if the "expansionTech" research has been completed
    const expansionTechCompleted = researchCompleted.expansionTech;

    // Add the conditions for expansionCenter
    if (buildingId === "expansionCenter" && expansionTechCompleted) {
      return true;
    }

    // Check for SteelMaking Tech
    if (buildingId === "steelMill" && researchCompleted.steelMaking) {
      return true;
    }

    // Check for GameWin
    if (researchCompleted.gameWon) {
      alert("Congrats. You won the Demo. Feedback highly appreciated. Also, take a screenshot of your factory and share it, that would be even more appreciated :)");
      researchCompleted.gameWon = false;
    }

    // Check for GameWin
    if (researchCompleted.gameWon2) {
      alert("Wow Impressive! Now I really want to see your factory! How long did it take you to get here?");
      researchCompleted.gameWon2 = false;
    }

    // Check for GameWin
    if (researchCompleted.gameWon3) {
      alert("This you must explain to me.");
      researchCompleted.gameWon3 = false;
    }

    // The "kiln" building is always unlocked
    if (buildingId === "kiln") {
      return true;
    }

    for (const parcel of parcels) {
      if (buildingId === "ironSmelter" && parcel.resources.bricks > 0) {
        return true;
      }

      if (buildingId === "coalPowerPlant" && parcel.resources.ironPlates > 0) {
        return true;
      }

      if (parcel.buildings.coalPowerPlant > 0) {
        ui.updateSectionVisibility("energy-section", true);
      }

      if (
        (buildingId === "ironMiner" || buildingId === "stoneMiner" || buildingId === "coalMiner") &&
        parcel.resources.ironPlates > 0 &&
        parcel.buildings.coalPowerPlant > 0
      ) {
        const shouldBeVisible = parcel.buildings.ironMiner > 0 || parcel.buildings.stoneMiner > 0 || parcel.buildings.coalMiner > 0;
        ui.updateSectionVisibility("project-section", shouldBeVisible);
        ui.updateSectionVisibility("research-section", shouldBeVisible);
        return true;
      }



      if (
        (buildingId === "copperMiner" || buildingId === "copperSmelter") &&
        parcel.buildings.ironMiner > 0 &&
        parcel.buildings.stoneMiner > 0 &&
        parcel.buildings.coalMiner > 0
      ) {
        return true;
      }

      if (buildingId === "gearPress" && parcel.resources.copperPlates > 0) {
        return true;
      }

      if (buildingId === "cableExtruder" && parcel.resources.gears > 0) {
        return true;
      }

      if (buildingId === "greenChipFactory" && parcel.resources.copperCables > 0) {
        return true;
      }

      if (buildingId === "redScienceLab" && parcel.resources.greenChips > 0) {
        return true;
      }

      if (buildingId === "researchCenter" && parcel.resources.redScience > 0) {
        return true;
      }

      if ((buildingId === "forwardBelt" || buildingId === "backwardBelt") && parcel.buildings.expansionCenter > 0) {
        return true;
      }
    }

    return false;
  }



  // Update the progression system based on the current game state
  update(gameState) {
    // Iterate through all buildings and check if their requirements are met
    // If a building's requirements are met, unlock the building
    const buildingList = window.buildingManager.getBuildingList();
    for (const i in buildingList) {
      const buildingId = buildingList[i].id
      if (this.checkRequirements(buildingId, gameState)) {
        this.unlockBuilding(buildingId);
      }
    }
  }
}


// Initialize the progression manager
window.progressionManager = new ProgressionManager();
