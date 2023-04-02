// Performance Notes: We can estimate the total limit for units to be <200ms blocking time around 5k.

const factoryUnitsTable = document.getElementById("factory-units-table");
const biterUnitsTable = document.getElementById("biter-units-table");
const ammunitionElement = document.getElementById("ammunition");
const battleLog = document.getElementById("battle-log");
const startBattleButton = document.getElementById("start-battle");
const inputValues = {};

document.addEventListener("DOMContentLoaded", () => {



  const biterUnits = [
    ...createUnits("Biter", BiterUnit, 1000, 80, 5, 0),
    ...createUnits("Medium Biter", BiterUnit, 1000, 160, 10, 5),
    ...createUnits("Big Biter", BiterUnit, 1000, 320, 25, 25),
    // Add more units...
  ];

  const factoryUnits = [];

  const startingAmmunition = {
    "Standard": 120000,
    "Armor Penetrating": 120000,
    "Piercing": 120000,
  };

  const battle = new Battle(factoryUnits, biterUnits, startingAmmunition, updateUI);



  // Update the ammunition element
  ammunitionElement.innerText = battle.ammunition;

  updateUI(factoryUnits, factoryUnitsCatalogue, biterUnits, ammunition, []);

  // Update the battle log
  battle.logs.forEach((log) => {
    const logDiv = document.createElement("div");
    logDiv.innerText = log;
    battleLog.appendChild(logDiv);
  });

  // Add event listener for the start battle button
  startBattleButton.addEventListener("click", async () => {
    // Sort factoryUnits so that Walls are first
    factoryUnits.sort((a, b) => {
      if (a.name === "Wall") {
        return -1;
      } else if (b.name === "Wall") {
        return 1;
      } else {
        return 0;
      }
    });

    startBattleButton.disabled = true;

    await battle.run();

    // Re-enable the start battle button after the battle is finished
    startBattleButton.disabled = false;
  });
});

class Unit {
  constructor(name, health, attack, armor) {
    this.name = name;
    this.health = health;
    this.maxHealth = health;
    this.attack = attack;
    this.armor = armor;
  }

  dealDamage(damage) {
    this.health -= damage;
    return damage;
  }
}

class FactoryUnit extends Unit {
  constructor(name, health, attack, armor, consumesAmmo, cost) {
    super(name, health, attack, armor);
    this.consumesAmmo = consumesAmmo;
    this.cost = cost;
  }
}

// Initialize your factoryUnits and biterUnits here
const factoryUnitsCatalogue = [
  new FactoryUnit("Wall", 1500, 0, 0, 0, { ironPlates: 25, bricks: 20 }),
  new FactoryUnit("Turret", 100, 20, 3, 1, { ironPlates: 50, bricks: 40 }),
  // ... additional factory unit types ...
];


class BiterUnit extends Unit {}


class Ammunition {
  constructor(name, damage, armorPenetration, piercing) {
    this.name = name;
    this.damage = damage;
    this.armorPenetration = armorPenetration;
    this.piercing = piercing;
  }
}

const ammunitionTypes = [
  new Ammunition("Melee", 0,0,false),
  new Ammunition("Standard", 10, 0, false),
  new Ammunition("Armor Penetrating", 5, 0.5, false),
  new Ammunition("Piercing", 10, 0, true),
];

class Battle {
  constructor(factoryUnits, biterUnits, ammunition, updateUI) {
    this.factoryUnits = factoryUnits;
    this.biterUnits = biterUnits;
    this.ammunition = ammunition;
    this.ticks = 120;
    this.logs = [];
    this.updateUI = updateUI;
  }

  checkBattleStatus() {
    const factoryUnitsAlive = this.factoryUnits.some((unit) => unit.health > 0);
    const biterUnitsAlive = this.biterUnits.some((unit) => unit.health > 0);

    if (!factoryUnitsAlive) {
      return "lose";
    }

    if (!biterUnitsAlive) {
      return "win";
    }

    if (this.tick >= this.ticks) {
      return "draw";
    }

    return null;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async run() {
    let battleStatus = null;
    for (let i = 0; i < this.ticks; i++) {
      console.log("Run factoryUnits", this.factoryUnits);
      console.log("Run factoryUnits.length", this.factoryUnits.length);
      if (this.factoryUnits.length === 0 || this.biterUnits.length === 0) {
        break;
      }

      this.fight();
      await this.sleep(200);
      console.log("Run factoryUnits after fight", this.factoryUnits);

      // Deep copy the factoryUnits and biterUnits arrays
      const factoryUnitsCopy = JSON.parse(JSON.stringify(this.factoryUnits));
      const biterUnitsCopy = JSON.parse(JSON.stringify(this.biterUnits));

      console.log("factoryUnitsCopy", factoryUnitsCopy);

      // Update the UI
      this.updateUI(factoryUnitsCopy, factoryUnitsCatalogue, biterUnitsCopy, this.ammunition, this.logs, true);




      // Log the current step
      for (const log of this.logs) {
        console.log(log);
      }
      this.logs = []; // Clear the logs for the next step

      battleStatus = this.checkBattleStatus();
      if (battleStatus) {
        break;
      }
    }

    switch (battleStatus) {
      case "win":
        console.log("Factory units win!");
        break;
      case "lose":
        console.log("Biter units win!");
        break;
      case "draw":
        console.log("It's a draw!");
        break;
      default:
        console.log("Battle status could not be determined.");
        break;
    }
  }

  fight() {
    let factoryDamages = [];
    let ammoConsumed = {};

    for (const factoryUnit of this.factoryUnits) {
      if (factoryUnit.attack > 0) {
        // Choose ammunition type based on your logic or randomly
        const selectedAmmo = ammunitionTypes[Math.floor(Math.random() * ammunitionTypes.length)];

        if (this.ammunition[selectedAmmo.name] >= factoryUnit.consumesAmmo) {
          // console.log('Factory Unit Damage:', factoryUnit.attack);
          // console.log('Selected Ammo Damage:', selectedAmmo.damage);
          const totalDamage = factoryUnit.attack + selectedAmmo.damage;
          factoryDamages.push({ damage: totalDamage, ammo: selectedAmmo });
          this.ammunition[selectedAmmo.name] -= factoryUnit.consumesAmmo;
          ammoConsumed[selectedAmmo.name] = (ammoConsumed[selectedAmmo.name] || 0) + factoryUnit.consumesAmmo;
        }
      }
    }

    let biterDamages = [];
    for (const biterUnit of this.biterUnits) {
      // console.log("Biter Damage:", biterUnit.attack);
      biterDamages.push({ damage: biterUnit.attack, ammo: ammunitionTypes[0] });
    }

    // this.logs.push(
    //   `Factory Units Attack for total Damage: ${factoryDamages.reduce((a, b) => a + b, 0)}`
    // );
    // this.logs.push(
    //   `Factory Units Consume ${ammoConsumed} amount of Ammunition. Remaining Ammunition: ${this.ammunition}`
    // );

    this.attackUnits("Factory",this.factoryUnits, this.biterUnits, factoryDamages);
    this.attackUnits("Biters",this.biterUnits, this.factoryUnits, biterDamages);
    // console.log("Biter Damages --------:", biterDamages);
    // console.log("Factory Damages --------:", factoryDamages);
    // this.logs.push(
    //   `Biter Units Attack for total Damage: ${biterDamages.reduce((a, b) => a + b, 0)}`
    // );
  }

  attackUnits(faction, attackingUnits, defendingUnits, damages) {
    const killCounts = {};

    for (const damageObj of damages) {
      let remainingDamage = damageObj.damage;

      for (let i = 0; i < defendingUnits.length && remainingDamage > 0; i++) {
        const unit = defendingUnits[i];

        if (unit) {
          const armorPenetration = unit.armor * (1 - damageObj.ammo.armorPenetration);
          const damageToDeal = Math.max(remainingDamage - armorPenetration, 0);

          const actualDamageDealt = unit.dealDamage(damageToDeal);
          // console.log("actualDamageDealt", faction, actualDamageDealt);

          if (damageObj.ammo.piercing && unit.health <= 0) {
            remainingDamage -= (actualDamageDealt + unit.health);
          } else {
            remainingDamage -= actualDamageDealt;
          }

          // console.log("remainingDamage", faction, remainingDamage);

          if (unit.health <= 0) {
            // Increment the kill count for this unit type
            killCounts[unit.name] = (killCounts[unit.name] || 0) + 1;

            defendingUnits.splice(i, 1);
            i--;

            // If the ammunition has the piercing property, apply remaining damage to the next unit
            if (damageObj.ammo.piercing) {
              i--;
            }
          }
        }
      }
    }

    // Update the logs with the grouped kill events
    for (const [unitName, killCount] of Object.entries(killCounts)) {
      this.logs.push(`${faction} Units kill ${killCount} ${unitName}.`);
    }
  }
}

/* Fight Setup */
function createUnits(unitType, unitClass, count, ...unitArgs) {
  const units = [];

  for (let i = 0; i < count; i++) {
    units.push(new unitClass(unitType, ...unitArgs));
  }

  return units;
}


/* UI */
function updateUI(factoryUnits, factoryUnitsCatalogue, biterUnits, ammunition, logs, battleStarted = false) {
  // Clear the tables
  factoryUnitsTable.innerHTML = "";
  biterUnitsTable.innerHTML = "";

  // Add headers to the tables
  const factoryHeader = document.createElement("tr");
  const biterHeader = document.createElement("tr");

  ["Type", "Health", "Count"].forEach((headerText) => {
    const factoryTh = document.createElement("th");
    const biterTh = document.createElement("th");
    factoryTh.innerText = headerText;
    biterTh.innerText = headerText;
    factoryHeader.appendChild(factoryTh);
    biterHeader.appendChild(biterTh);
  });

  if (!battleStarted) {
    const setupTh = document.createElement("th");
    setupTh.innerText = "Setup";
    setupTh.colSpan = 3;
    factoryHeader.appendChild(setupTh);
  }

  factoryUnitsTable.appendChild(factoryHeader);
  biterUnitsTable.appendChild(biterHeader);

  // Group the factory units
  const displayFactoryUnits = battleStarted ? Object.values(groupUnits(factoryUnits)) : factoryUnitsCatalogue;
  console.log("factoryUnits:", factoryUnits);
  console.log("displayFactoryUnits:", displayFactoryUnits);
  // Update the factory units table
  for (const unitData of displayFactoryUnits) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    const unitName = unitData.name;
    nameCell.innerText = unitName;
    row.appendChild(nameCell);

    const healthCell = document.createElement("td");
    const progressBar = createHealthProgressBar(unitData.health, unitData.maxHealth);
    healthCell.appendChild(progressBar);
    row.appendChild(healthCell);

    const countCell = document.createElement("td");
    const unitCount = factoryUnits.filter((u) => u.name === unitName).length;
    countCell.innerText = unitCount;
    row.appendChild(countCell);

    //Pre Battle Setup
    if (!battleStarted) {
      const buyArmyController = createQuantityInput(unitName, inputValues);

      const buyArmyControllerCell = document.createElement("td");
      buyArmyControllerCell.appendChild(buyArmyController);
      row.appendChild(buyArmyControllerCell);

      const buyCell = document.createElement("td");
      const buyButton = document.createElement("button");
      buyButton.innerText = "Buy";
      buyButton.classList.add("buy-unit");
      buyButton.dataset.unitName = unitName;
      buyCell.appendChild(buyButton);
      row.appendChild(buyCell);

      const sellCell = document.createElement("td");
      const sellButton = document.createElement("button");
      sellButton.innerText = "Sell";
      sellButton.classList.add("sell-unit");
      sellButton.dataset.unitName = unitName;
      sellCell.appendChild(sellButton);
      row.appendChild(sellCell);
    }


    factoryUnitsTable.appendChild(row);
  }

  // Group the biter units
  const groupedBiterUnits = groupUnits(biterUnits);

  // Update the biter units table
  for (const [unitName, unitData] of Object.entries(groupedBiterUnits)) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.innerText = unitName;
    row.appendChild(nameCell);

    const healthCell = document.createElement("td");
    const progressBar = createHealthProgressBar(unitData.health, unitData.maxHealth);
    healthCell.appendChild(progressBar);
    row.appendChild(healthCell);

    const countCell = document.createElement("td");
    countCell.innerText = unitData.count;
    row.appendChild(countCell);

    biterUnitsTable.appendChild(row);
  }

  // Update the ammunition element
  ammunitionElement.innerHTML = ""; // Clear the innerHTML
  for (const [ammoName, ammoQuantity] of Object.entries(ammunition)) {
    const ammoInfo = document.createElement("p");
    ammoInfo.innerText = `${ammoName}: ${ammoQuantity}`;
    ammunitionElement.appendChild(ammoInfo);
  }

  // Update the battle log
  logs.forEach((log) => {
    const logElement = document.createElement("li");
    logElement.innerText = log;
    battleLog.appendChild(logElement);
  });

  // Pre Battle
  if (!battleStarted) {
    // Add event listeners to buy and sell buttons
    document.querySelectorAll(".buy-unit").forEach((button, index) => {
      button.addEventListener("click", (event) => {
        const unitName = event.target.dataset.unitName;
        const quantityInput = document.querySelectorAll(".unit-quantity")[index];
        const quantity = parseInt(quantityInput.value);
        inputValues[unitName] = quantity;
        buyFactoryUnit(unitName, factoryUnits, factoryUnitsCatalogue, quantity);
        updateUI(factoryUnits, factoryUnitsCatalogue, biterUnits, ammunition, logs, battleStarted, inputValues);
      });
    });

    document.querySelectorAll(".sell-unit").forEach((button, index) => {
      button.addEventListener("click", (event) => {
        const unitName = event.target.dataset.unitName;
        const quantityInput = document.querySelectorAll(".unit-quantity")[index];
        const quantity = parseInt(quantityInput.value);
        inputValues[unitName] = quantity;
        sellFactoryUnit(unitName, factoryUnits, quantity);
        updateUI(factoryUnits, factoryUnitsCatalogue, biterUnits, ammunition, logs, battleStarted, inputValues);
      });
    });

    // Calculate and display the total cost for the army
    displayArmyCost(factoryUnits);
  }
}

function createQuantityInput(unitName, inputValues) {
  const buyArmyController = document.createElement("div");
  const minusBtn = document.createElement("div");
  const plusBtn = document.createElement("div");
  const quantityInput = document.createElement("input");

  // Set properties and attributes
  buyArmyController.className = "input-controller";

  minusBtn.className = "input-btn";
  minusBtn.innerText = "-";

  plusBtn.className = "input-btn";
  plusBtn.innerText = "+";

  quantityInput.type = "number";
  quantityInput.className = "input-display";

  quantityInput.value = inputValues[unitName] || 1;
  quantityInput.min = 1;
  quantityInput.classList.add("unit-quantity");

  // Append elements
  buyArmyController.append(minusBtn, quantityInput, plusBtn);

  // Function to handle button clicks
  const handleButtonClick = (increment) => {
    const currentVal = parseInt(quantityInput.value, 10) || 0;
    const newVal = currentVal + increment;

    if (newVal >= 1) {
      quantityInput.value = newVal;
    }
  };

  // Attach event listeners
  minusBtn.addEventListener("click", () => handleButtonClick(-1));
  plusBtn.addEventListener("click", () => handleButtonClick(1));

  return buyArmyController;
}

function groupUnits(units) {
  const groupedUnits = {};

  for (const unit of units) {
    const unitKey = unit.health === unit.maxHealth ? unit.name : `${unit.name}-${unit.health}`;

    if (!groupedUnits[unitKey]) {
      groupedUnits[unitKey] = {
        name: unit.name,
        health: unit.health,
        maxHealth: unit.maxHealth,
        count: 0,
      };
    }

    groupedUnits[unitKey].count++;
  }

  return groupedUnits;
}

function createHealthProgressBar(currentHealth, maxHealth) {
  const progressBarContainer = document.createElement("div");
  progressBarContainer.style.width = "100%";
  progressBarContainer.style.backgroundColor = "#ccc";

  const progressBar = document.createElement("div");
  progressBar.style.width = `${(currentHealth / maxHealth) * 100}%`;
  progressBar.style.height = "20px";
  progressBar.style.backgroundColor = "#4caf50";

  progressBarContainer.appendChild(progressBar);
  return progressBarContainer;
}

function buyFactoryUnit(unitName, factoryUnits, factoryUnitsCatalogue, quantity) {
  const unitTemplate = factoryUnitsCatalogue.find((u) => u.name === unitName);

  if (unitTemplate) {
    for (let i = 0; i < quantity; i++) {
      const newUnit = new FactoryUnit(
        unitTemplate.name,
        unitTemplate.health,
        unitTemplate.attack,
        unitTemplate.armor,
        unitTemplate.consumesAmmo,
        unitTemplate.cost
      );
      factoryUnits.push(newUnit);
    }
    console.log(factoryUnits);
  }
}

function sellFactoryUnit(unitName, factoryUnits, quantity) {
  for (let i = 0; i < quantity; i++) {
    const index = factoryUnits.findIndex((u) => u.name === unitName);
    if (index !== -1) {
      factoryUnits.splice(index, 1);
    } else {
      break;
    }
  }
}

function displayArmyCost(factoryUnits) {
  const resourceCostTable = document.getElementById("resource-cost-table");
  resourceCostTable.innerHTML = "";

  const costs = calculateTotalArmyCost(factoryUnits);

  for (const [resource, cost] of Object.entries(costs)) {
    const row = document.createElement("tr");

    const resourceNameCell = document.createElement("td");
    resourceNameCell.innerText = resource;
    row.appendChild(resourceNameCell);

    const costCell = document.createElement("td");
    costCell.innerText = cost;
    row.appendChild(costCell);

    resourceCostTable.appendChild(row);
  }
}

function calculateTotalArmyCost(factoryUnits) {
  const costs = {};

  factoryUnits.forEach((unit) => {
    console.log('Unit:', unit);
    console.log('Unit cost:', unit.cost);
    for (const [resource, cost] of Object.entries(unit.cost)) {
      costs[resource] = (costs[resource] || 0) + cost;
    }
  });

  return costs;
}
