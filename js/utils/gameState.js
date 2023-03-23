const gameState = {
  get parcels() {
    return window.parcels.parcelList;
  },
  research: {}, // Fill with your research data
  progression: {
    unlockedBuildings: new Set(), // Store the unlocked buildings here
  },
  // Add other relevant game state data as needed
};

window.gameState = gameState;

window.gameState = gameState;

window.saveGame = function() {
  localStorage.setItem('gameState', JSON.stringify(window.gameState));
  const projectsJSON = JSON.stringify(projectsModule.projects);
  localStorage.setItem("savedProjects", projectsJSON);
  localStorage.setItem("researchData", window.researchManager.saveResearchData());
};

window.loadGame = function() {
  const savedState = localStorage.getItem('gameState');
  if (savedState) {
    const parsedState = JSON.parse(savedState);

    // Ensure parcels object is properly linked and updated
    const updatedParcelList = parsedState.parcels.map((parcelData, index) => {
      // Create a new parcel object using the saved parcel data
      const parcel = new Parcel(parcelData.id, parcelData.maxBuildings);

      // Assign the properties from the saved parcel data
      Object.assign(parcel.buildings, parcelData.buildings);
      Object.assign(parcel.resources, parcelData.resources);
      Object.assign(parcel.beltUsage, parcelData.beltUsage);
      Object.assign(parcel.previousResources, parcelData.previousResources);
      Object.assign(parcel.upgrades, parcelData.upgrades);
      parcel.productionRateModifier = parcelData.productionRateModifier;
      parcel.consumptionRateModifier = parcelData.consumptionRateModifier;
      Object.assign(parcel.buildingProductionRateModifiers, parcelData.buildingProductionRateModifiers);
      Object.assign(parcel.buildingConsumptionRateModifiers, parcelData.buildingConsumptionRateModifiers);

      // Update the existing parcel object with the new one
      window.parcels.parcelList[index] = parcel;

      return parcel;
    });

    // Assign the research data
    if (parsedState.research) {
      window.gameState.research = parsedState.research;
    }

    const researchData = localStorage.getItem("researchData");
    if (researchData) {
      window.researchManager.loadResearchData(researchData);
    }

    // Check for the existence of progression and unlockedBuildings in parsedState
    if (
      parsedState.progression &&
      parsedState.progression.unlockedBuildings &&
      Array.isArray(parsedState.progression.unlockedBuildings)
    ) {
      window.gameState.progression.unlockedBuildings = new Set(parsedState.progression.unlockedBuildings);
    } else {
      window.gameState.progression.unlockedBuildings = new Set();
    }

    // Add parcels to the UI
    window.gameState.parcels.forEach((parcel, index) => {
      if (index > 0) {
        ui.addParcelToUI(parcel);
      }
    });

    //Load saved Projects
    const savedProjects = localStorage.getItem("savedProjects");

    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      projectsModule.setProjects(parsedProjects);
    }

    // Add other relevant game state data assignments as needed
  }
};

// Save the game state every minute
setInterval(window.saveGame, 60 * 1000);

function showResetConfirmation() {
  const resetConfirmation = document.getElementById('resetConfirmation');
  resetConfirmation.style.display = 'flex';
}

function hideResetConfirmation() {
  const resetConfirmation = document.getElementById('resetConfirmation');
  resetConfirmation.style.display = 'none';
}

function resetGameAndHideConfirmation() {
  resetGame();
  hideResetConfirmation();
}

function resetGame() {
  // Clear the saved game state from local storage
  localStorage.removeItem('gameState');

  // Reload the page
  location.reload();
}
