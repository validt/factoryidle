const gameState = {
  parcels: window.parcels.parcelList, // Reference to the global parcelList array
  research: {}, // Fill with your research data
  progression: {
    unlockedBuildings: new Set(), // Store the unlocked buildings here
  },
  // Add other relevant game state data as needed
};

window.gameState = gameState;
