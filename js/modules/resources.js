const resourceCategories = {
  stone: { category: "1Raw", order: 1 },
  coal: { category: "1Raw", order: 2 },
  ironOre: { category: "1Raw", order: 3 },
  copperOre: { category: "1Raw", order: 4 },
  oilBarrel: { category: "1Raw", order: 5 },
  bricks: { category: "2Basic", order: 1 },
  ironPlates: { category: "2Basic", order: 2 },
  copperPlates: { category: "2Basic", order: 3 },
  gears: { category: "2Basic", order: 4 },
  copperCables: { category: "2Basic", order: 5 },
  steel: { category: "2Basic", order: 6 },
  petroleumBarrel: { category: "2Basic", order: 7 },
  plastics: { category: "2Basic", order: 8 },
  sulfur: { category: "2Basic", order: 9 },
  greenChips: { category: "3Advanced", order: 1 },
  redChips: { category: "3Advanced", order: 2 },
  redScience: { category: "3Advanced", order: 3 },
  researchPoints: { category: "4Points", order: 1 },
  expansionPoints: { category: "4Points", order: 2 },
  alienArtefacts: { category: "4Points", order: 3 },
  standardAmmunition:  { category: "5Military", order: 1},
  armorPenetratingAmmunition:  { category: "5Military", order: 2},
  piercingAmmunition:  { category: "5Military", order: 3},
};

window.resourceCategories = Object.keys(resourceCategories)
  .map(resource => ({
    name: resource,
    category: resourceCategories[resource].category,
    order: resourceCategories[resource].order,
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
