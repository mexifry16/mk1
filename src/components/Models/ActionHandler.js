import { villageActions } from '../Data/Actions';
import { LocationCodesEnum as LocCodes } from '../Enums/LocationCodesEnum';
import { JSONCheatCopy } from '../Helpers/JSONHelpers';

export class ActionHandler {
    constructor(args) {
        this._actionList = []
        this._unavailableActions = []
        this._curLocation = new Location() 
        this._curCharacter = new Character()  
        this._curResources = {gold:7, wood:7} //new Resources()
        if (args.hasOwnProperty("location"))
            this._curLocation = args.location
        if (args.hasOwnProperty("character"))
            this._curCharacter = args.character 
        refreshActions()

        //loadPreviewActions()
    }

    get actions() {
        return this._actionList
    }

    get previewActions() {
        return this._previewList
    }

    set resources(newResources) {
        this._curResources = newResources
        refreshActions()
    }

    changeArea(location) {
        this._location = location
        refreshActions()
    }

    changeCharacter(character) {
        this._curCharacter = character
        refreshActions()
    }

    refreshActions() {
        let refreshedList = getActionsByLocation(this._curLocation)
        refreshedList = filterActionsByCharacter(this._curCharacter, refreshedList)
        this._actionList = refreshedList
    }

    refreshUnavailableActions() {
        let refreshedActions = filterActionsByCharacter(this._curCharacter, this._unavailableActions)
        //TODO: Combine refreshedActions with the existing Action list (.append?)
        //set the new list
    }

    getActionsByLocation(location) {
        let areaList = []
        let filterLocation = this._curLocation
        if (location)
            filterLocation = location

        switch (filterLocation.code) { //TODO. how I address parts of the location and character are probably going to change
            case LocCodes.Village:
                areaList = JSONCheatCopy(villageActions)
                break;
            case LocCodes.Beach:
                areaList = JSONCheatCopy(villageActions)
                break;
            default:
                areaList = ["Broken List"]

        }
        return areaList
    }

    filterActionsByCharacter(character, actions) {
        let ineligibleActions = []
        let eligibleActions = []

        actions.forEach((action) => {
            if (actionAvailable(character, action))
                eligibleActions.push(action)
            else
                unavailableActions.push(action)
        })

        this._unavailableActions = ineligibleActions //maybe this shouldn't get set here
        return areaActions

    }

    actionAvailable(character, action) {
        let available = true

        //Check tier
        if (character.tier < action.tierReq)
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

}
