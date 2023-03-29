document.addEventListener("DOMContentLoaded", () => {
  const parcelManipulationMenuButton = document.getElementById("parcelManipulationMenuButton");
  const parcelManipulationMenu = document.getElementById("parcelManipulationMenu");

  parcelManipulationMenuButton.addEventListener("click", () => {
    parcelManipulationMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (event) => {
    // Check if the click is outside the menu and its button
    if (
      !parcelManipulationMenuButton.contains(event.target) &&
      !parcelManipulationMenu.contains(event.target)
    ) {
      parcelManipulationMenu.classList.add("hidden");
    }
  });

  // Rename
  document.getElementById('renameButton').addEventListener('click', () => {
      document.getElementById('renameParcelOverlay').style.display = 'flex';
  });

  document.getElementById('renameParcelButton').addEventListener('click', () => {
      renameParcel();
      document.getElementById('renameParcelOverlay').style.display = 'none';
  });

  document.getElementById('closeRenameParcelOverlay').addEventListener('click', () => {
      document.getElementById('renameParcelOverlay').style.display = 'none';
  });

  // Change Color
  document.getElementById('changeColorButton').addEventListener('click', () => {
      document.getElementById('colorPickerOverlay').style.display = 'flex';
  });

  document.getElementById('applyColorButton').addEventListener('click', () => {
      changeParcelColor();
      document.getElementById('colorPickerOverlay').style.display = 'none';
  });

  document.getElementById('closeColorPickerOverlay').addEventListener('click', () => {
      document.getElementById('colorPickerOverlay').style.display = 'none';
  });



});


function changeParcelColor() {
    const selectedColor = document.getElementById('colorPickerInput').value;
    if (selectedColor) {
        const selectedParcelIndex = ui.getSelectedParcelIndex();
        window.parcels.parcelList[selectedParcelIndex].color = selectedColor;
        updateParcelColor(selectedParcelIndex, selectedColor);
    } else {
        alert('Please select a valid color for the parcel.');
    }
}

function updateParcelColor(parcelIndex, color) {
    const parcelTab = document.getElementById(`tab-parcel-${parcelIndex+1}`);
    console.log(`tab-parcel-${parcelIndex}`);
    if (parcelTab) {
        parcelTab.style.setProperty("background", color, "important");
    }
}
function updateParcelTab(parcel) {
  const parcelTab = document.getElementById(`tab-${parcel.id}`);
  if (parcelTab) {
    const name = parcel.name || `Parcel ${parcel.id}`;
    parcelTab.textContent = name;
  }
}

function renameParcel() {
    const newName = document.getElementById('parcelNameInput').value;
    if (newName) {
        const selectedParcelIndex = ui.getSelectedParcelIndex();
        window.parcels.parcelList[selectedParcelIndex].name = newName;

        // Call updateParcelTab
        updateParcelTab(window.parcels.parcelList[selectedParcelIndex]);

    } else {
        alert('Please enter a valid name for the parcel.');
    }
}
