import { villageActions } from './Actions'


export function getAreaActions(area, character, resources) {
    let areaActions = []
    let activeActionsList = null

    switch (area) {
        case "Village":
            activeActionsList = villageActions
            break;
        default:
            activeActionsList = ["Broken List"]

    }

    activeActionsList.forEach(function (action, actionIndex) {
        if (character) {
            if (actionAvailable(character, action, resources))
                areaActions.push(action)
        } else {
            areaActions.push(action)
            
        }
    })

    return areaActions
}

function actionAvailable(character, action, resources) {
    let available = true
    //Check level
    if (character.lvl < action.lvlRequirement)
        available = false
    //Check resources
    if (available && action.resourceReq.length > 0) {
        for (const [resourceName, requirement] of Object.entries(action.resourceReqs)) {
            if (resources[resourceName] < requirement) {
                available = false
            }
        }
    }
    //Check Items
    if (available && action.itemReq.length > 0) {
        let itemFound = false
        let itemIndex = 0
        while (!itemFound && itemIndex < action.itemReq.length) {
            if (character.hasItem(action.itemReq[itemIndex]))
                itemFound = true
            itemIndex++
        }
        if (!itemFound)
            available = false
    }

    return available
}