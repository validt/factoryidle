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
      new Project("Exploration Mission 1", "exploration", { ironPlates: 50 }, { expansionPoints: 2}),
      new Project("Exploration Mission 2", "exploration", { ironPlates: 75 }, { expansionPoints: 4}),
      new Project("Exploration Mission 3", "exploration", { ironPlates: 125 }, { expansionPoints: 5}),
      new Project("Exploration Mission 4", "exploration", { ironPlates: 200 }, { expansionPoints: 6}),
      new Project("Exploration Mission 5", "exploration", { ironPlates: 300 }, { expansionPoints: 7}),
      new Project("Exploration Mission 6", "exploration", { ironPlates: 450 }, { expansionPoints: 8}),
      new Project("Exploration Mission 7", "exploration", { ironPlates: 675 }, { expansionPoints: 9}),
      new Project("Exploration Mission 8", "exploration", { ironPlates: 1025 }, { expansionPoints: 10}),
      new Project("Exploration Mission 9", "exploration", { ironPlates: 1550 }, { expansionPoints: 11}),
      new Project("Exploration Mission 10", "exploration", { ironPlates: 2325 }, { expansionPoints: 12}),
      new Project("Exploration Mission 11", "exploration", { ironPlates: 3500 }, { expansionPoints: 13}),
      new Project("Exploration Mission 12", "exploration", { ironPlates: 5250 }, { expansionPoints: 14}),
      new Project("Exploration Mission 13", "exploration", { ironPlates: 7875 }, { expansionPoints: 15}),
      new Project("Exploration Mission 14", "exploration", { ironPlates: 11825 }, { expansionPoints: 16}),
      new Project("Exploration Mission 15", "exploration", { ironPlates: 17750 }, { expansionPoints: 17}),
      new Project("Exploration Mission 16", "exploration", { ironPlates: 26625 }, { expansionPoints: 18}),
      new Project("Exploration Mission 17", "exploration", { ironPlates: 39950 }, { expansionPoints: 19}),
      new Project("Exploration Mission 18", "exploration", { ironPlates: 59925 }, { expansionPoints: 20}),
      new Project("Exploration Mission 19", "exploration", { ironPlates: 89900 }, { expansionPoints: 21}),
      new Project("Exploration Mission 20", "exploration", { ironPlates: 134850 }, { expansionPoints: 22}),
      new Project("Exploration Mission 21", "exploration", { ironPlates: 202275 }, { expansionPoints: 23}),
      new Project("Exploration Mission 22", "exploration", { ironPlates: 303425 }, { expansionPoints: 24}),
      new Project("Exploration Mission 23", "exploration", { ironPlates: 455150 }, { expansionPoints: 25}),
      new Project("Exploration Mission 24", "exploration", { ironPlates: 682725 }, { expansionPoints: 26}),
      new Project("Exploration Mission 25", "exploration", { ironPlates: 1024100 }, { expansionPoints: 27}),
      new Project("Exploration Mission 26", "exploration", { ironPlates: 1536150 }, { expansionPoints: 28}),
      new Project("Exploration Mission 27", "exploration", { ironPlates: 2304225 }, { expansionPoints: 29}),
      new Project("Exploration Mission 28", "exploration", { ironPlates: 3456350 }, { expansionPoints: 30}),
      new Project("Exploration Mission 29", "exploration", { ironPlates: 5184525 }, { expansionPoints: 31}),
      new Project("Exploration Mission 30", "exploration", { ironPlates: 7776800 }, { expansionPoints: 32}),
      new Project("Exploration Mission 31", "exploration", { ironPlates: 11665200 }, { expansionPoints: 33}),
      new Project("Exploration Mission 32", "exploration", { ironPlates: 17497800 }, { expansionPoints: 34}),
      new Project("Exploration Mission 33", "exploration", { ironPlates: 26246700 }, { expansionPoints: 35}),
      new Project("Exploration Mission 34", "exploration", { ironPlates: 39370050 }, { expansionPoints: 36}),
      new Project("Exploration Mission 35", "exploration", { ironPlates: 59055075 }, { expansionPoints: 37}),
      new Project("Exploration Mission 36", "exploration", { ironPlates: 88582625 }, { expansionPoints: 38}),
      new Project("Exploration Mission 37", "exploration", { ironPlates: 132873950 }, { expansionPoints: 39}),
      new Project("Exploration Mission 38", "exploration", { ironPlates: 199310925 }, { expansionPoints: 40}),
      new Project("Exploration Mission 39", "exploration", { ironPlates: 298966400 }, { expansionPoints: 41}),
      new Project("Exploration Mission 40", "exploration", { ironPlates: 448449600 }, { expansionPoints: 42}),
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

  function setProjects(newProjects) {
    for (const category in projects) {
      if (newProjects.hasOwnProperty(category)) {
        projects[category] = newProjects[category];
      }
    }
    renderProjects();
  }


  return {
    renderProjects,
    startProject,
    projects,
    setProjects,
  };
})();

window.projects = projectsModule;
