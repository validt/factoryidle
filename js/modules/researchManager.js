class Research {
  constructor(id, name, cost) {
    this.id = id;
    this.name = name;
    this.cost = cost;
  }
}

class ResearchManager {
  constructor() {
    this.researchList = [];
    this.completedResearch = new Set(); // Store completed researches here
  }

  addResearch(research) {
    this.researchList.push(research);
  }

  getResearch(id) {
    return this.researchList.find(research => research.id === id);
  }

  populateResearchDropdown() {
    const researchSelect = document.getElementById("researchSelect");

    // Clear the existing options from the dropdown
    while (researchSelect.firstChild) {
      researchSelect.removeChild(researchSelect.firstChild);
    }

    const researchList = window.researchManager.researchList;
    researchList.forEach(research => {
      if (!window.researchManager.isResearchCompleted(research.id)) {
        const optionElement = document.createElement("option");
        optionElement.value = research.id;
        optionElement.textContent = `${research.name} - ${JSON.stringify(research.cost)}`;
        researchSelect.appendChild(optionElement);
      }
    });
  }

  isResearchCompleted(researchId) {
    return this.completedResearch.has(researchId);
  }

  completeResearch(researchId) {
    this.completedResearch.add(researchId);
  }
}



// Initialize the research manager
window.researchManager = new ResearchManager();

// Add research options here
window.researchManager.addResearch(new Research('expansionTech', 'Expansion Tech', { researchPoints: 4 }));
window.researchManager.addResearch(new Research('militaryTech', 'Military Tech', { researchPoints: 20000 }));
// Add more research options as needed

window.researchManager = researchManager;
