export const ActionList = [
    {
        "id": 0,
        "name": "Punch Tree",
        "lvlRequirement":0,
        "prerequisites": null,
        "cost": null,
        "effect": {"wood":1}
    },
    {
        "id": 0,
        "name": "Chop Wood",
        "lvlRequirement": 2,
        "prerequisites": null,
        "cost": null,
        "effect": { "wood": 1 }
    }

]

export function getAvailableActions(character){
    let availableActions = []
    ActionList.forEach(function (action, actionIndex) {
        if (actionAvailable(character, action))
            availableActions.push(action)
    })
    return availableActions
}

function actionAvailable(character, action){
    let available = true
    if (character.lvl < action.lvlRequirement)
        available = false
    return available
}