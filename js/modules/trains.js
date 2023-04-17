document.addEventListener("DOMContentLoaded", function() {
  const scheduleOverlay = document.getElementById("schedule-overlay");
  const closeScheduleOverlayButton = document.getElementById("close-schedule-overlay");
  const addScheduleButton = document.getElementById("add-schedule");
  const editScheduleButtons = document.getElementsByClassName("menu-button");

  function openScheduleOverlay() {
    scheduleOverlay.style.display = "block";
  }

  function closeScheduleOverlay() {
    scheduleOverlay.style.display = "none";
  }

  addScheduleButton.addEventListener("click", openScheduleOverlay);

  for (const button of editScheduleButtons) {
    button.addEventListener("click", openScheduleOverlay);
  }

  closeScheduleOverlayButton.addEventListener("click", closeScheduleOverlay);
});
