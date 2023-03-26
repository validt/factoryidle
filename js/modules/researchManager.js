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

  saveResearchData() {
    const completedResearchData = Array.from(this.completedResearch);
    return JSON.stringify(completedResearchData);
  }

  loadResearchData(savedData) {
    const completedResearchData = JSON.parse(savedData);
    this.completedResearch = new Set(completedResearchData);
    this.populateResearchDropdown();
  }
}



// Initialize the research manager
window.researchManager = new ResearchManager();

// Add research options here
window.researchManager.addResearch(new Research('expansionTech', 'Expansion Tech', { researchPoints: 4 }));
window.researchManager.addResearch(new Research('remoteConstruction', 'Remote Construction', { researchPoints: 12 }));
window.researchManager.addResearch(new Research('steelMaking', 'Steel Making', { researchPoints: 24 }));
window.researchManager.addResearch(new Research('oilProcessing', 'Oil Processing', { researchPoints: 30 }));
window.researchManager.addResearch(new Research('advancedElectronics', 'Advanced Electronics', { researchPoints: 36 }));
window.researchManager.addResearch(new Research('blueprintTech', 'Blueprint Tech', { researchPoints: 40 }));
window.researchManager.addResearch(new Research('beaconTech', 'Beacon Tech', { researchPoints: 100 }));
window.researchManager.addResearch(new Research('gameWon', 'Win the Demo', { researchPoints: 400 }));
window.researchManager.addResearch(new Research('gameWon2', 'Win Harder', { researchPoints: 4000 }));
window.researchManager.addResearch(new Research('gameWon3', 'Win too Hard', { researchPoints: 40000 }));
//window.researchManager.addResearch(new Research('militaryTech', 'Military (Not Implemented Yet)', { researchPoints: 200000 }));
// Add more research options as needed

window.researchManager = researchManager;
