const gameState = {
  parcels: window.parcels.parcelList, // Reference to the global parcelList array
  research: {}, // Fill with your research data
  progression: {
    unlockedBuildings: new Set(), // Store the unlocked buildings here
  },
  // Add other relevant game state data as needed
};

window.gameState = gameState;

window.saveGame = function() {
  localStorage.setItem('gameState', JSON.stringify(window.gameState));
};

window.loadGame = function() {
  const savedState = localStorage.getItem('gameState');
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    Object.assign(window.gameState, parsedState);

    // Ensure parcels object is properly linked and updated
    window.parcels.parcelList.forEach((parcel, index) => {
      Object.assign(parcel, window.gameState.parcels[index]);
    });

    window.gameState.parcels = window.parcels.parcelList;
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
