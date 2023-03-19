const resources = (() => {
    const resourceData = {
        ironOre: {
            productionRate: 1,
            consumptionRate: 0,
        },
    };

    function setProductionRate(resourceName, rate) {
        if (resourceData.hasOwnProperty(resourceName)) {
            resourceData[resourceName].productionRate = rate;
        }
    }

    function setConsumptionRate(resourceName, rate) {
        if (resourceData.hasOwnProperty(resourceName)) {
            resourceData[resourceName].consumptionRate = rate;
        }
    }

    function getProductionRate(resourceName) {
        return resourceData.hasOwnProperty(resourceName) ? resourceData[resourceName].productionRate : 0;
    }

    function getConsumptionRate(resourceName) {
        return resourceData.hasOwnProperty(resourceName) ? resourceData[resourceName].consumptionRate : 0;
    }

    function getResourceData() {
        return resourceData;
    }

    return {
        setProductionRate,
        setConsumptionRate,
        //getProductionRate,
        getConsumptionRate,
        getResourceData,
    };
})();

window.resources = resources;
