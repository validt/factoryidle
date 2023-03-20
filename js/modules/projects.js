const projectsModule = (() => {

  class Project {
    constructor(name, category, cost, reward) {
      this.name = name;
      this.category = category;
      this.cost = cost;
      this.reward = reward;
      this.completed = false;
    }
  }

  const projectCategories = {
    exploration: "Exploration",
    research: "Research",
  };

  const projects = {
    exploration: [
      new Project("Exploration Mission 1", "exploration", { ironPlates: 50 }, { expansionPoints: 2 }),
      new Project("Exploration Mission 2", "exploration", { ironPlates: Math.round(50 * 1.5) }, { expansionPoints: Math.round(2 * 1.25) }),
      new Project("Exploration Mission 3", "exploration", { ironPlates: Math.round(50 * 1.5 * 1.5) }, { expansionPoints: Math.round(2 * 1.25 * 1.25) }),
      new Project("Exploration Mission 4", "exploration", { ironPlates: Math.round(50 * 1.5 * 1.5 * 1.5) }, { expansionPoints: Math.round(2 * 1.25 * 1.25 * 1.25) }),
    ],
    research: [
      new Project("Research Project 1", "research", { ironPlates: 50 }, { researchPoints: 2 }),
      new Project("Research Project 2", "research", { ironPlates: Math.round(50 * 1.5) }, { researchPoints: Math.round(2 * 1.25) }),
      new Project("Research Project 3", "research", { ironPlates: Math.round(50 * 1.5 * 1.5) }, { researchPoints: Math.round(2 * 1.25 * 1.25) }),
      new Project("Research Project 4", "research", { ironPlates: Math.round(50 * 1.5 * 1.5 * 1.5) }, { researchPoints: Math.round(2 * 1.25 * 1.25 * 1.25) }),
    ],
  };

  function renderProjects() {
    const projectsContainer = document.getElementById("projects-container");
    projectsContainer.style.display = "flex";
    projectsContainer.innerHTML = ""; // Clear the container before rendering projects

    for (const category in projects) {
      const categoryDiv = document.createElement("div");
      categoryDiv.classList.add("project-category");

      const project = projects[category][0]; // Display only the next project
      if (project && !project.completed) { // Check if project exists before checking the 'completed' property
        const projectDetails = document.createElement("div"); // Create a new div for project details
        projectDetails.classList.add("project-box"); // Add the border style to the project details div

        const projectName = document.createElement("p");
        projectName.textContent = project.name;
        projectDetails.appendChild(projectName);

        const startProjectButton = document.createElement("button");
        startProjectButton.textContent = "Start Project";
        startProjectButton.onclick = () => startProject(project);
        projectDetails.appendChild(startProjectButton);

        addTooltipToProjectButtons(startProjectButton, project);

        categoryDiv.appendChild(projectDetails); // Append project details div to the category div
      }

      projectsContainer.appendChild(categoryDiv);
    }
  }

  function addTooltipToProjectButtons(projectButton, project) {
    const tooltip = document.getElementById("tooltip");

    // Show tooltip on mouseover
    projectButton.addEventListener("mouseover", (event) => {
      const costText = Object.entries(project.cost)
        .map(([resource, cost]) => `${cost} ${resource}`)
        .join("<br>");
      const rewardText = Object.entries(project.reward)
        .map(([resource, reward]) => `${reward} ${resource}`)
        .join("<br>");
      const projectText = `Cost:<br>${costText}<br>Reward:<br>${rewardText}`;

      tooltip.innerHTML = projectText;
      tooltip.style.display = "block";
      tooltip.style.left = event.pageX + 10 + "px";
      tooltip.style.top = event.pageY + 10 + "px";
    });

    // Hide tooltip on mouseout
    projectButton.addEventListener("mouseout", () => {
      tooltip.style.display = "none";
    });

    // Update tooltip position on mousemove
    projectButton.addEventListener("mousemove", (event) => {
      tooltip.style.left = event.pageX + 10 + "px";
      tooltip.style.top = event.pageY + 10 + "px";
    });
  }

  function hasEnoughResources(parcel, cost) {
    for (const resource in cost) {
      if (!parcel.resources[resource] || parcel.resources[resource] < cost[resource]) {
        return false;
      }
    }
    return true;
  }

  function startProject(project) {
    const selectedParcel = parcels.getParcel(ui.getSelectedParcelIndex());

    if (hasEnoughResources(selectedParcel, project.cost)) {
      for (const resource in project.cost) {
        selectedParcel.resources[resource] -= project.cost[resource];
      }

      for (const resource in project.reward) {
        if (!selectedParcel.resources[resource]) {
          selectedParcel.resources[resource] = 0;
        }
        selectedParcel.resources[resource] += project.reward[resource];
      }

      project.completed = true;
      // Remove the completed project and add the next project in the category (if any)
      projects[project.category].shift();

      // Hide the tooltip
      const tooltip = document.getElementById("tooltip");
      tooltip.style.display = "none";

      // Update the UI to reflect the changes
      ui.updateResourceDisplay(selectedParcel);
      //projectsContainer.innerHTML = ""; // Remove this line
      renderProjects();
    } else {
      alert("You don't have enough resources to start this project.");
    }
  }

  return {
    renderProjects,
    startProject,
  };
})();

window.projects = projectsModule;