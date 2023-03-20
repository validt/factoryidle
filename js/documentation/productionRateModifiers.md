Production and Consumption Rate Modifiers in the Game
This game features production and consumption rate modifiers that affect the rate at which buildings produce and consume resources. The modifiers are applied at different levels: global, parcel, parcel-specific building, and individual buildings. The modifiers can be positive or negative, allowing you to increase or decrease the production and consumption rates.

Global Modifiers
Global modifiers affect all the parcels and buildings in the game. They can be set as follows:

parcels.globalProductionRateModifier = x;
parcels.globalConsumptionRateModifier = y;
x and y represent the production and consumption rate modifiers, respectively. They can be any number, with positive values increasing the rate and negative values decreasing it.

Parcel Modifiers
Parcel modifiers affect all the buildings within a specific parcel. They can be set as follows:

parcel.productionRateModifier = a;
parcel.consumptionRateModifier = b;
a and b represent the production and consumption rate modifiers for a specific parcel, respectively.

Parcel-Specific Building Modifiers
Parcel-specific building modifiers affect individual buildings within a specific parcel. They can be set as follows:

parcel.buildingProductionRateModifiers[buildingId] = c;
parcel.buildingConsumptionRateModifiers[buildingId] = d;
buildingId is the identifier for a specific building type, while c and d represent the production and consumption rate modifiers for that building within the parcel, respectively.

Modifier Calculation
The total production and consumption rate modifiers are calculated by adding the global, parcel, and parcel-specific building modifiers. These total modifiers are then used to adjust the production and consumption rates of each building.

For example, if a building has a base production rate of p and the total production rate modifier is m, the adjusted production rate will be p * (1 + m).

Similarly, for a building with a base consumption rate of q and the total consumption rate modifier is n, the adjusted consumption rate will be q * (1 + n).

These adjusted rates are used to update the resources within the parcels, affecting the gameplay and strategy.
