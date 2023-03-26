const resourceCategories = {
  stone: { category: "Raw", order: 1 },
  coal: { category: "Raw", order: 2 },
  ironOre: { category: "Raw", order: 3 },
  copperOre: { category: "Raw", order: 4 },
  oilBarrel: { category: "Raw", order: 5 },
  bricks: { category: "Basic", order: 1 },
  ironPlates: { category: "Basic", order: 2 },
  copperPlates: { category: "Basic", order: 3 },
  gears: { category: "Basic", order: 4 },
  copperCables: { category: "Basic", order: 5 },
  steel: { category: "Basic", order: 6 },
  petroleumBarrel: { category: "Basic", order: 7 },
  plastics: { category: "Basic", order: 8 },
  sulfur: { category: "Basic", order: 9 },
  greenChips: { category: "Advanced", order: 1 },
  redChips: { category: "Advanced", order: 2 },
  redScience: { category: "Advanced", order: 3 },
  researchPoints: { category: "Points", order: 1 },
  expansionPoints: { category: "Points", order: 2 },
  blueprintPoints: { category: "Points", order: 3 },

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
    resources: category.resources.sort((a, b) => a.order - b.order),
  }))
  .reverse();
