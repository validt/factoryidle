// trains.js

document.addEventListener("DOMContentLoaded", function () {
  const scheduleOverlay = document.getElementById("schedule-overlay");
  const closeScheduleOverlayButton = document.getElementById("close-schedule-overlay");
  const addScheduleButton = document.getElementById("add-schedule");

  // Add an event listener for the "Buy Train" button
  const buyTrainButton = document.getElementById("buy-train-button");
  buyTrainButton.addEventListener("click", buyTrain);

  // Click event listener to close the train menu when clicking outside of it
  document.addEventListener("click", (event) => {
    const trainMenu = document.getElementById("trainMenu");
    const trainMenuButton = document.querySelector(`[id^="edit-train-"]`);

    if (
      !trainMenu.contains(event.target) &&
      !trainMenuButton.contains(event.target)
    ) {
      trainMenu.classList.add("hidden");
    }
  });

  // Sell Train Listener
  const sellTrainButton = document.getElementById("sellTrainDropdownItem");
  sellTrainButton.addEventListener("click", () => {
    const trainMenu = document.getElementById("trainMenu");
    const trainId = parseInt(trainMenu.getAttribute("data-train-id"));

    if (trainId) {
      sellTrain(trainId);
      trainMenu.classList.add("hidden");
      updateTrainListUI();
    }
  });

  // Show Assign Schedule Overlay
  const assignScheduleDropdownItem = document.getElementById("assignScheduleDropdownItem");
  assignScheduleDropdownItem.addEventListener("click", () => {
    const trainMenu = document.getElementById("trainMenu");
    const trainId = trainMenu.getAttribute("data-train-id");
    trainMenu.classList.add("hidden");
    console.log("open with id", trainId);
    showAssignScheduleOverlay(trainId);
  });

  //Show Rename Overlay
  const renameDropdownItem = document.getElementById("renameTrainDropdownItem");
  renameDropdownItem.addEventListener("click", () => {
    const trainMenu = document.getElementById("trainMenu");
    const trainId = parseInt(trainMenu.getAttribute("data-train-id"), 10);
    showRenameTrainOverlay(trainId);
    trainMenu.classList.add("hidden");
  });

  function openScheduleOverlay() {
    // Perform any necessary preparations before opening the overlay, such as:
    // - Resetting form fields
    // - Loading the selected schedule data into the form fields
    // - Updating the overlay content based on the selected schedule

    // Open the schedule overlay by setting its display style to 'block'
    scheduleOverlay.style.display = "block";
  }

  function closeScheduleOverlay() {
    // Perform any necessary cleanup after closing the overlay, such as:
    // - Clearing form fields
    // - Resetting validation states
    // - Clearing any temporary data related to the overlay

    // Close the schedule overlay by setting its display style to 'none'
    scheduleOverlay.style.display = "none";
  }

  addScheduleButton.addEventListener("click", () => {
    const newScheduleId = findAvailableScheduleId();
    const name = `Schedule ${newScheduleId}`;
    addSchedule(name, []);
  });

  closeScheduleOverlayButton.addEventListener("click", closeScheduleOverlay);
});

// Train constructor
function Train(id, name, scheduleId) {
  this.id = id;
  this.name = name;
  this.scheduleId = scheduleId;
  this.currentAction = "Waiting";
  this.acceleration = 1;
  this.maxSpeed = 10;
  this.cargo = [
    /*
    stone: 100,
    ironOre: 150,
    */
  ];
  this.maxCargo = 1000;
}

// Schedule constructor
function Schedule(id, name, parcelIds) {
  this.id = id;
  this.name = name;
  this.parcelIds = parcelIds;
}

// Train Stations will be accessible via parcels.parcelList[i].buildings.trainStation

function generateUniqueTrainId() {
  let id = 1;
  while (gameState.trainList.find((train) => train.id === id)) {
    id++;
  }
  return id;
}

function addTrain(name, scheduleId) {
  // Add a new train to the train list
  const id = generateUniqueTrainId();
  const newTrain = new Train(id, name, scheduleId);
  gameState.trainList.push(newTrain);
  // Update the UI to display the new train
  updateTrainListUI()
}

function removeTrain(trainId) {
  // Remove a train from the train list
  gameState.trainList = gameState.trainList.filter((train) => train.id !== trainId);
  // Update the UI to remove the train
  // This could involve updating a table, list, or other HTML elements
}

function addSchedule(name, parcelIds) {
  // Add a new schedule to the schedule list
  const newScheduleId = findAvailableScheduleId();
  const newSchedule = new Schedule(newScheduleId, name, parcelIds);
  gameState.scheduleList.push(newSchedule);
  // Update the UI to display the new schedule
  updateScheduleListUI()
}

function findAvailableScheduleId() {
  let availableId = 0;
  const usedIds = new Set(gameState.scheduleList.map((schedule) => schedule.id));

  while (usedIds.has(availableId)) {
    availableId++;
  }

  return availableId;
}

function removeSchedule(scheduleId) {
  // Remove a schedule from the schedule list
  gameState.scheduleList = gameState.scheduleList.filter((schedule) => schedule.id !== scheduleId);
  // Update the UI to remove the schedule
  // This could involve updating a table, list, or other HTML elements
}

function addStationToSchedule(scheduleId, parcelId) {
  // Add a parcel to the given schedule
  // Find the schedule in your schedule list data structure
  const schedule = gameState.scheduleList.find((schedule) => schedule.id === scheduleId);
  if (schedule) {
    // Add the parcel to the schedule's parcelIds array
    schedule.parcelIds.push(parcelId);
    // Update the UI to display the new parcel in the schedule
    // This could involve updating a table, list, or other HTML elements
  }
}

function removeStationFromSchedule(scheduleId, parcelId) {
  // Remove a parcel from the given schedule
  // Find the schedule in your schedule list data structure
  const schedule = gameState.scheduleList.find((schedule) => schedule.id === scheduleId);
  if (schedule) {
    // Remove the parcel from the schedule's parcelIds array
    schedule.parcelIds = schedule.parcelIds.filter((id) => id !== parcelId);
    // Update the UI to remove the parcel from the schedule
    // This could involve updating a table, list, or other HTML elements
  }
}

function updateSchedule(scheduleId, newScheduleData) {
  // Update a schedule with new data
  // Find the schedule in your schedule list data structure
  const schedule = gameState.scheduleList.find((schedule) => schedule.id === scheduleId);
  if (schedule) {
    // Update the schedule's properties with the new data
    schedule.name = newScheduleData.name;
    schedule.parcelIds = newScheduleData.parcelIds;
    // Update the UI to reflect the changes
    // This could involve updating a table, list, or other HTML elements
  }
}

function updateTrain(trainId, newName = null, newScheduleId = null) {
  // Find the train in your train list data structure
  if (typeof trainId === "string") {
    trainId = parseInt(trainId);
  }
  const train = gameState.trainList.find((t) => t.id === trainId);
  console.log(train);

  if (!train) {
    console.error(`Train with ID ${trainId} not found.`);
    return;
  }

  // Update the train's properties with the new data
  if (newName !== null) {
    train.name = newName;
  }

  if (newScheduleId !== null) {
    const newSchedule = gameState.scheduleList.find((s) => s.id === newScheduleId);

    if (!newSchedule) {
      console.error(`Schedule with ID ${newScheduleId} not found.`);
      return;
    }

    train.scheduleId = newScheduleId;
  }

  // Update the UI to reflect the changes
  updateTrainListUI();
}

function moveUpStation(scheduleId, stationId) {
// Move a station up in the given schedule
// Find the schedule in your schedule list data structure
// Swap the station with the one above it in the schedule's stations array
// Update the UI to reflect the changes
}

function moveDownStation(scheduleId, stationId) {
// Move a station down in the given schedule
// Find the schedule in your schedule list data structure
// Swap the station with the one below it in the schedule's stations array
// Update the UI to reflect the changes
}

function saveSchedule(scheduleId) {
// Save changes made to a schedule
// Perform any necessary validation on the schedule data
// Update the schedule data in your schedule list data structure
// Update the UI to reflect the changes
// Close the schedule overlay
}

function buyTrain() {
  // Buy a new train
  // Deduct the train cost from the player's resources (skip cost logic for now)

  // Add a new train to the train list
  const id = generateUniqueTrainId();
  const name = `Train ${id}`;
  const emptySchedule = [];
  addTrain(name, emptySchedule);

  // Update the UI to reflect the changes (handled by addTrain function)
}

function sellTrain(trainId) {
  // Sell a train
  // Add the train's value to the player's resources (skip cost logic for now)

  // Remove the train from the train list
  removeTrain(trainId);

  // Update the UI to reflect the changes (handled by removeTrain function)
}

function calculateCargoSpace(cargo) {
  let totalSpace = 0;

  for (const resource in cargo) {
    const resourceAmount = cargo[resource];
    const resourceDensity = resourceMetadata[resource]?.density || 1;
    totalSpace += resourceAmount * resourceDensity;
  }

  return totalSpace;
}

//---------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------- UI Functions -------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------

/* ---------------------------------------- Train Menu ---------------------------------------- */

function updateTrainListUI() {
  const trainTableBody = document.querySelector("#train-table tbody");

  // Clear the existing table rows
  trainTableBody.innerHTML = "";

  // Loop through the train list and create new table rows
  gameState.trainList.forEach((train) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    const scheduleCell = document.createElement("td");
    const currentActionCell = document.createElement("td");
    const cargoCell = document.createElement("td");

    // Assuming the train object is named 'train'
    const currentCargoSpace = calculateCargoSpace(train.cargo);

    //Create Name Cell Name
    nameCell.innerHTML = `${train.name}`;

    // Create a menu button for each train
    const menuButton = document.createElement("button");
    menuButton.id = `edit-train-${train.id}`;
    menuButton.classList.add("menu-button");
    menuButton.textContent = "⚙";
    menuButton.addEventListener("click", (event) => {
      const trainMenu = document.getElementById("trainMenu");
      trainMenu.setAttribute("data-train-id", train.id);

      // Set the position of the dropdown menu
      const rect = event.target.getBoundingClientRect();
      trainMenu.style.left = `${rect.left}px`;
      trainMenu.style.top = `${rect.bottom}px`;

      trainMenu.classList.toggle("hidden");

      // Stop event propagation to prevent triggering the document click event listener
      event.stopPropagation();
    });

    nameCell.appendChild(menuButton);

    // Find the schedule by its ID
    const schedule = gameState.scheduleList.find((s) => s.id === train.scheduleId);

    // Check if the schedule exists before trying to access its name
    if (schedule) {
      scheduleCell.textContent = schedule.name;
    } else {
      scheduleCell.textContent = "No Schedule";
    }

    currentActionCell.textContent = train.currentAction;
    cargoCell.textContent = `${currentCargoSpace} / ${train.maxCargo}`;

    row.appendChild(nameCell);
    row.appendChild(scheduleCell);
    row.appendChild(currentActionCell);
    row.appendChild(cargoCell);

    trainTableBody.appendChild(row);
  });
}


function showAssignScheduleOverlay(trainId) {
  const overlay = document.createElement("div");
  overlay.id = "assign-schedule-overlay";
  overlay.classList.add("train-manipulation-overlay");

  const overlayContainer = document.createElement("div");
  overlayContainer.classList.add("overlay-container");

  const dropdown = document.createElement("select");
  dropdown.id = "schedule-dropdown";
  dropdown.classList.add("overlay-element");

  // Loop through available schedules and add them to the dropdown
  gameState.scheduleList.forEach((schedule) => {
    const option = document.createElement("option");
    option.value = schedule.id;
    option.textContent = schedule.name;
    dropdown.appendChild(option);
  });

  const submitButton = document.createElement("button");
  submitButton.textContent = "Assign Schedule";
  submitButton.classList.add("overlay-element");
  submitButton.addEventListener("click", () => {
    const selectedScheduleId = parseInt(dropdown.value, 10);
    console.log(selectedScheduleId);
    updateTrain(trainId, null, selectedScheduleId);
    document.body.removeChild(overlay);
  });

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.classList.add("overlay-element");
  cancelButton.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  overlayContainer.appendChild(dropdown);
  overlayContainer.appendChild(submitButton);
  overlayContainer.appendChild(cancelButton);
  overlay.appendChild(overlayContainer);
  document.body.appendChild(overlay);
}

function showRenameTrainOverlay(trainId) {
  const overlay = document.createElement("div");
  overlay.id = "rename-train-overlay";
  overlay.classList.add("train-manipulation-overlay");

  const container = document.createElement("div");
  container.classList.add("overlay-container");

  const input = document.createElement("input");
  input.id = "rename-train-input";
  input.type = "text";
  input.placeholder = "New Train Name";

  const renameButton = document.createElement("button");
  renameButton.textContent = "Rename";
  renameButton.addEventListener("click", () => {
    const newName = input.value;
    updateTrain(trainId, newName);
    document.body.removeChild(overlay);
  });

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  container.appendChild(input);
  container.appendChild(renameButton);
  container.appendChild(cancelButton);
  overlay.appendChild(container);
  document.body.appendChild(overlay);

  // Close the overlay when clicking outside the form
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}

/* ---------------------------------------- Schedule Menu ---------------------------------------- */

function createScheduleRow(schedule) {
  const row = document.createElement("tr");

  const nameCell = document.createElement("td");
  const nameText = document.createTextNode(`${schedule.name} `);
  nameCell.appendChild(nameText);

  const editButton = document.createElement("button");
  editButton.textContent = "⚙";
  editButton.classList.add("edit-schedule-button");
  editButton.id = `edit-schedule-${schedule.id}`;
  nameCell.appendChild(editButton);

  const trainCountCell = document.createElement("td");
  const trainCount = gameState.trainList.filter(train => train.schedule === schedule.id).length;
  const trainCountText = document.createTextNode(trainCount);
  trainCountCell.appendChild(trainCountText);

  row.appendChild(nameCell);
  row.appendChild(trainCountCell);

  return row;
}

function updateScheduleListUI() {
  const scheduleTableBody = document.getElementById("schedule-table").tBodies[0];

  // Remove existing rows
  while (scheduleTableBody.firstChild) {
    scheduleTableBody.removeChild(scheduleTableBody.firstChild);
  }

  // Add updated schedule rows
  gameState.scheduleList.forEach(schedule => {
    const row = createScheduleRow(schedule);
    scheduleTableBody.appendChild(row);
  });

  // Add event listeners for edit schedule buttons
  gameState.scheduleList.forEach(schedule => {
    const editButton = document.getElementById(`edit-schedule-${schedule.id}`);
    editButton.addEventListener("click", () => {
      openScheduleOverlay(schedule.id);
    });
  });
}
