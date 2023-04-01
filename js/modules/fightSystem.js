const factoryUnitsTable = document.getElementById("factory-units-table");
const biterUnitsTable = document.getElementById("biter-units-table");
const ammunitionElement = document.getElementById("ammunition");
const battleLog = document.getElementById("battle-log");
const startBattleButton = document.getElementById("start-battle");

document.addEventListener("DOMContentLoaded", () => {

  // Initialize your factoryUnits and biterUnits here
  // For example:
  const factoryUnits = [
    new FactoryUnit("Soldier", 100, 30, 10, 1),
    // Add more units...
  ];

  const biterUnits = [
    new BiterUnit("Biter", 80, 5, 5),
    new BiterUnit("Biter", 80, 5, 5),
    new BiterUnit("Biter", 80, 5, 5),
    new BiterUnit("Biter", 80, 5, 5),
    // Add more units...
  ];

  const ammunition = 100;

  const battle = new Battle(factoryUnits, biterUnits, ammunition, updateUI);

  // Update the factory units table
  for (const unit of factoryUnits) {
    const row = factoryUnitsTable.insertRow(-1);
    row.insertCell(0).innerText = unit.name;
    row.insertCell(1).innerText = unit.health;
    row.insertCell(2).innerText = unit.attack;
    row.insertCell(3).innerText = unit.armor;
    row.insertCell(4).innerText = unit.consumesAmmo;
  }

  // Update the biter units table
  for (const unit of biterUnits) {
    const row = biterUnitsTable.insertRow(-1);
    row.insertCell(0).innerText = unit.name;
    row.insertCell(1).innerText = unit.health;
    row.insertCell(2).innerText = unit.attack;
    row.insertCell(3).innerText = unit.armor;
  }

  // Update the ammunition element
  ammunitionElement.innerText = battle.ammunition;

  // Update the battle log
  battle.logs.forEach((log) => {
    const logDiv = document.createElement("div");
    logDiv.innerText = log;
    battleLog.appendChild(logDiv);
  });

  // Add event listener for the start battle button
  startBattleButton.addEventListener("click", async () => {
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
    this.attack = attack;
    this.armor = armor;
  }

  dealDamage(damage) {
    const effectiveDamage = Math.max(damage - this.armor, 0);
    this.health -= effectiveDamage;
    return effectiveDamage;
  }
}

class FactoryUnit extends Unit {
  constructor(name, health, attack, armor, consumesAmmo) {
    super(name, health, attack, armor);
    this.consumesAmmo = consumesAmmo;
  }
}

class BiterUnit extends Unit {}


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
      if (this.factoryUnits.length === 0 || this.biterUnits.length === 0) {
        break;
      }

      this.fight();
      await this.sleep(1000);

      // Update the UI
      this.updateUI();

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
    let totalFactoryDamage = 0;
    let ammoConsumed = 0;

    for (const factoryUnit of this.factoryUnits) {
      if (this.ammunition >= factoryUnit.consumesAmmo) {
        totalFactoryDamage += factoryUnit.attack;
        this.ammunition -= factoryUnit.consumesAmmo;
        ammoConsumed += factoryUnit.consumesAmmo;
      }
    }

    let totalBiterDamage = 0;
    for (const biterUnit of this.biterUnits) {
      totalBiterDamage += biterUnit.attack;
    }

    this.logs.push(
      `Factory Units Attack for total Damage: ${totalFactoryDamage}`
    );
    this.logs.push(
      `Factory Units Consume ${ammoConsumed} amount of Ammunition. Remaining Ammunition: ${this.ammunition}`
    );

    this.attackUnits(this.factoryUnits, this.biterUnits, totalFactoryDamage);
    this.attackUnits(this.biterUnits, this.factoryUnits, totalBiterDamage);

    this.logs.push(
      `Biter Units Attack for total Damage: ${totalBiterDamage}`
    );
  }

  attackUnits(attackingUnits, defendingUnits, totalDamage) {
    let remainingDamage = totalDamage;

    for (let i = 0; i < defendingUnits.length; i++) {
      const unit = defendingUnits[i];
      const damageDealt = unit.dealDamage(remainingDamage);

      remainingDamage -= damageDealt;

      if (unit.health <= 0) {
        this.logs.push(
          `${attackingUnits[0].name} Units kill 1 ${unit.name}.`
        );
        defendingUnits.splice(i, 1);
        i--;

        if (remainingDamage <= 0) {
          break;
        }
      }
    }
  }
}

function updateUI() {
  // Clear the tables
  factoryUnitsTable.innerHTML = "";
  biterUnitsTable.innerHTML = "";

  // Update the factory units table
  for (const unit of battle.factoryUnits) {
    const row = factoryUnitsTable.insertRow(-1);
    row.insertCell(0).innerText = unit.name;
    row.insertCell(1).innerText = unit.health;
    row.insertCell(2).innerText = unit.attack;
    row.insertCell(3).innerText = unit.armor;
    row.insertCell(4).innerText = unit.consumesAmmo;
  }

  // Update the biter units table
  for (const unit of battle.biterUnits) {
    const row = biterUnitsTable.insertRow(-1);
    row.insertCell(0).innerText = unit.name;
    row.insertCell(1).innerText = unit.health;
    row.insertCell(2).innerText = unit.attack;
    row.insertCell(3).innerText = unit.armor;
  }

  // Update the ammunition element
  ammunitionElement.innerText = battle.ammunition;

  // Update the battle log
  battle.logs.forEach((log) => {
    const logDiv = document.createElement("div");
    logDiv.innerText = log;
    battleLog.appendChild(logDiv);
  });
}
