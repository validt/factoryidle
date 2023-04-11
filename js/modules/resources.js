const resourceCategories = {
  stone: { category: "1Raw", order: 1, icon48: "assets/stone-48.png" },
  coal: { category: "1Raw", order: 2, icon48: "assets/coal-48.png" },
  ironOre: { category: "1Raw", order: 3, icon48: "assets/ironOre-48.png" },
  copperOre: { category: "1Raw", order: 4, icon48: "assets/copperOre-48.png" },
  oilBarrel: { category: "1Raw", order: 5, icon48: "assets/oilBarrel-48.png" },
  bricks: { category: "2Basic", order: 1, icon48: "assets/bricks-48.png" },
  ironPlates: { category: "2Basic", order: 2, icon48: "assets/ironPlates-48.png" },
  copperPlates: { category: "2Basic", order: 3, icon48: "assets/copperPlates-48.png" },
  gears: { category: "2Basic", order: 4, icon48: "assets/gears-48.png" },
  copperCables: { category: "2Basic", order: 5, icon48: "assets/copperCables-48.png" },
  steel: { category: "2Basic", order: 6, icon48: "assets/steel-48.png" },
  petroleumBarrel: { category: "2Basic", order: 7, icon48: "assets/petroleumBarrel-48.png" },
  plastics: { category: "2Basic", order: 8, icon48: "assets/plastics-48.png" },
  sulfur: { category: "2Basic", order: 9, icon48: "assets/sulfur-48.png" },
  greenChips: { category: "3Advanced", order: 1, icon48: "assets/greenChips-48.png" },
  redChips: { category: "3Advanced", order: 2, icon48: "assets/redChips-48.png" },
  redScience: { category: "3Advanced", order: 3, icon48: "assets/redScience-48.png" },
  researchPoints: { category: "4Points", order: 1, icon48: "assets/researchPoints-48.png" },
  expansionPoints: { category: "4Points", order: 2, icon48: "assets/expansionPoints-48.png" },
  alienArtefacts: { category: "4Points", order: 3, icon48: "assets/alienArtefacts-48.png" },
  standardAmmunition:  { category: "5Military", order: 1, icon48: "assets/standardAmmunition-48.png"},
  armorPenetratingAmmunition:  { category: "5Military", order: 2, icon48: "assets/armorPenetratingAmmunition-48.png"},
  piercingAmmunition:  { category: "5Military", order: 3, icon48: "assets/piercingAmmunition-48.png"},
};

window.resourceCategories = Object.keys(resourceCategories)
  .map(resource => ({
    name: resource,
    category: resourceCategories[resource].category,
    order: resourceCategories[resource].order,
    icon48: resourceCategories[resource].icon48,
  }))
  .reduce((categories, resource) => {
    const index = categories.findIndex(cat => cat.name === resource.category);
    if (index !== -1) {
      categories[index].resources.push(resource);
    } else {
      categories.push({ name: resource.category, resources: [resource] });
    }
    return categories;
  }, [])
  .sort((a, b) => a.name.localeCompare(b.name))
  .map(category => ({
    ...category,
    resources: category.resources.sort((a, b) => b.order - a.order),
  }))
  .reverse();
