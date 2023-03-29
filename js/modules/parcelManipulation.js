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
  document.getElementById('renameDropdownItem').addEventListener('click', () => {
      document.getElementById('renameParcelOverlay').style.display = 'flex';
  });

  document.getElementById('renameParcelButton').addEventListener('click', () => {
      parcelManipulation.renameParcel();
      document.getElementById('renameParcelOverlay').style.display = 'none';
  });

  document.getElementById('closeRenameParcelOverlay').addEventListener('click', () => {
      document.getElementById('renameParcelOverlay').style.display = 'none';
  });

  // Change Color
  document.getElementById('changeColorDropdownItem').addEventListener('click', () => {
      document.getElementById('colorPickerOverlay').style.display = 'flex';
  });

  document.getElementById('applyColorButton').addEventListener('click', () => {
      parcelManipulation.changeParcelColor();
      document.getElementById('colorPickerOverlay').style.display = 'none';
  });

  document.getElementById('closeColorPickerOverlay').addEventListener('click', () => {
      document.getElementById('colorPickerOverlay').style.display = 'none';
  });

  document.getElementById('reset-color-btn').addEventListener('click', () => {
    parcelManipulation.resetColor();
    document.getElementById('colorPickerOverlay').style.display = 'none';
  });

  // Move
  document.getElementById('moveDropdownItem').addEventListener('click', () => {
      document.getElementById('moveParcelOverlay').style.display = 'flex';
  });

  document.getElementById('moveParcelButton').addEventListener('click', () => {
      parcelManipulation.moveParcel();
      document.getElementById('moveParcelOverlay').style.display = 'none';
  });

  document.getElementById('closeMoveParcelOverlay').addEventListener('click', () => {
      document.getElementById('moveParcelOverlay').style.display = 'none';
  });

});

const parcelManipulation = (() => {

/* Update Parcel Tab Function */
function updateParcelTab(index) {
    const parcel = window.parcels.parcelList[index];
    const parcelTab = document.getElementById(`tab-${parcel.id}`);
    if (parcelTab) {
        const displayName = parcel.name || `parcel-${index + 1}`;
        parcelTab.textContent = displayName;

        // Update the color of the parcel tab
        if (parcel.color) {
            parcelTab.style.setProperty("background", parcel.color, "important");
        } else {
            parcelTab.style.removeProperty("background");
            parcelTab.style.removeProperty("background", "important");
        }
    }
}

/* Move Parcel Functions */
function moveParcel() {
    const moveAmount = parseInt(document.getElementById('parcelMoveInput').value);
    if (!isNaN(moveAmount)) {
        const selectedParcelIndex = ui.getSelectedParcelIndex();
        const newIndex = selectedParcelIndex + moveAmount;
        const parcelList = window.parcels.parcelList;

        // Check if the new index is within the bounds of the parcel list
        if (newIndex >= 0 && newIndex < parcelList.length) {
            // Move the parcel in the parcelList
            const parcel = parcelList.splice(selectedParcelIndex, 1)[0];
            parcelList.splice(newIndex, 0, parcel);

            // Update the parcel IDs in the parcelList
            for (let i = 0; i < parcelList.length; i++) {
                parcelList[i].id = `parcel-${i + 1}`;
            }

            // Update the parcel tabs in the UI
            for (let i = 0; i < parcelList.length; i++) {
                const parcel = parcelList[i];
                const parcelTab = document.getElementById(`tab-${parcel.id}`);
                if (parcelTab) {
                    parcelTab.id = `tab-${parcel.id}`;

                    // Remove the old event listener
                    const newParcelTab = parcelTab.cloneNode(true);
                    parcelTab.parentNode.replaceChild(newParcelTab, parcelTab);

                    // Attach the new event listener with the updated parcel id
                    ui.addParcelClickListener(newParcelTab);

                    updateParcelTab(i);
                }
            }

            // Select the moved parcel in its new position
            selectParcel(newIndex);

            // Move the parcel visually
            const parcelContainer = document.getElementById('parcels');
            const parcelTab = document.getElementById(`tab-${parcel.id}`);
            const targetTab = newIndex < parcelList.length - 1
                ? document.getElementById(`tab-${parcelList[newIndex + 1].id}`)
                : null;

            if (newIndex > selectedParcelIndex) {
                if (targetTab) {
                    parcelContainer.insertBefore(parcelTab, targetTab);
                } else {
                    parcelContainer.appendChild(parcelTab);
                }
            } else {
                parcelContainer.insertBefore(parcelTab, targetTab);
            }

        } else {
            alert('Invalid move amount. Please enter a valid number.');
        }
    } else {
        alert('Please enter a valid move amount.');
    }
}

function setSelectedParcelIndex(index) {
    selectedParcelIndex = index;
}

function selectParcel(index) {
    const parcelTab = document.getElementById(`tab-${window.parcels.parcelList[index].id}`);
    if (parcelTab) {
        const prevSelected = document.querySelector(".parcel-tab.selected");
        if (prevSelected) {
            prevSelected.classList.remove("selected");
        }
        parcelTab.classList.add("selected");
        setSelectedParcelIndex(index);
        ui.selectParcel(index);
        ui.updateResourceDisplay(parcels.getParcel(index));
        ui.updateBuildingDisplay(parcels.getParcel(index));
    }
}

/* Change Color Functions */
function changeParcelColor() {
    const selectedColor = document.getElementById('colorPickerInput').value;
    if (selectedColor) {
        const selectedParcelIndex = ui.getSelectedParcelIndex();
        window.parcels.parcelList[selectedParcelIndex].color = selectedColor;
        updateParcelTab(selectedParcelIndex);
    } else {
        alert('Please select a valid color for the parcel.');
    }
}

function resetColor() {
  // Remove the color attribute from the selected parcel
  const selectedParcelIndex = ui.getSelectedParcelIndex();
  delete window.parcels.parcelList[selectedParcelIndex].color;
  updateParcelTab(selectedParcelIndex);
}

/* Rename Parcel Functions */
function renameParcel() {
    const newName = document.getElementById('parcelNameInput').value;
    if (newName) {
        const selectedParcelIndex = ui.getSelectedParcelIndex();
        window.parcels.parcelList[selectedParcelIndex].name = newName;
        updateParcelTab(selectedParcelIndex);
    } else {
        alert('Please enter a valid name for the parcel.');
    }
}

return {
    updateParcelTab,
    moveParcel,
    renameParcel,
    resetColor,
    changeParcelColor,
};

})();
