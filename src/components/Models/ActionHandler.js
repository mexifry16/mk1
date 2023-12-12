import { makeAutoObservable } from "mobx"
import { villageActions } from '../../Data/Actions';
import { LocationCodesEnum as LocCodes } from '../../Enums/LocationCodesEnum';
import { JSONCheatCopy } from '../../Helpers/JSONHelpers';
import ResourceHandler from './ResourceHandler';
import Character from './Character';
import { log } from '../Debugger';

export default class ActionHandler {

    constructor(args) {
        log("Constructing Action Handler")
        this._actionList = []
        this._ineligibleActions = []
        //this._curLocation = new Location() 
        this._curLocation = {
            locCode: "vil",
            name: "Village",
            tierReq: 0,
            itemReq: [],
            resourceReq: {}
        }
        //this._curCharacter = new Character()  
        //this._curResources = { gold: 7, wood: 7 } //new Resources()
        this._curResources = new ResourceHandler()
        this._curCharacter = new Character()

        if (args)
            Object.keys(args).forEach((key) => {
                this[`_${key}`] = args[key];
            });

        this.refreshActions()
        makeAutoObservable(this)
    }

    get curCharacter() {
        return this._curCharacter
    }

    get actions() {
        return this._actionList
    }

    get previewActions() {
        return this._previewList
    }

    set resources(newResources) {
        this._curResources = newResources
        this.refreshActions()
    }

    get resources() {
        return this._curResources
    }

    changeArea(location) {
        this._location = location
        this.refreshActions()
    }

    changeCharacter(character) {
        this._curCharacter = character
        this.refreshActions()
    }

    refreshActions() {
        let refreshedList = this.getActionsByLocation(this._curLocation)
        refreshedList = this.filterActionsByCharacter(this._curCharacter, refreshedList)
        this._actionList = refreshedList
    }

    refreshUnavailableActions() {
        let refreshedActions = this.filterActionsByCharacter(this._curCharacter, this._unavailableActions)
        //TODO: Combine refreshedActions with the existing Action list (.append?)
        //set the new list
    }

    getActionsByLocation(location) {
        let areaList = []
        let filterLocation = this._curLocation
        if (location)
            filterLocation = location

        switch (filterLocation.locCode) { //TODO. how I address parts of the location and character are probably going to change
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
            if (this.actionAvailable(character, action))
                eligibleActions.push(action)
            else
                ineligibleActions.push(action)
        })

        this._ineligibleActions = ineligibleActions //maybe this shouldn't get set here
        return eligibleActions

    }

    actionAvailable(character, action) {
        let available = true

        //Check tier
        if (character.tier < action.tierReq)
            available = false

        //Check resources
        if (available && action.resourceReq.length > 0) {
            for (const [resourceName, requirement] of Object.entries(action.resourceReqs)) {
                if (this._curResources[resourceName] < requirement) {
                    available = false
                }
            }
        }

        //Check Items
        if (available && action.itemReq.length > 0) {
            let itemsFound = false
            let itemIndex = 0
            //Loop through the item reqs
            while (!itemsFound && itemIndex < action.itemReq.length) {
                let item = this._curCharacter.inventory.get(action.itemReq[itemIndex])
                //if we don't find an item stop looking
                if (item === undefined)
                    break //TODO: I don't like doing this. Come up with a better loop condition
                itemIndex++
            }
            available = itemsFound
        }
        return available
    }

    doAction(actionIndex) {
        log("Doing Action (Action Handler)")
        let action = this._actionList[actionIndex]
        let message = "You do not have enough AP to do that action"
        let skipSwitch = false

        //Handle resting here so we don't spend AP
        if ("rest" in action.effect) {
            this._curCharacter.rest()
            message = action.message
            log(action.message)
            skipSwitch = true
        }

        if (this._curCharacter.curAP > 0 && !skipSwitch) {
            log("You have enough AP")
            //let results = availbleActions[actionIndex]
            for (const [resource, value] of Object.entries(action.effect)) {
                switch (resource) {
                    case "wood":
                        log("adding wood")
                        this._curResources.addWood(value)
                        break;
                    case "coin":
                        log("adding coins")
                        this._curResources.addCoins(value)
                        break;
                    default:
                        log("Resource Not Accounted For : ", resource)
                }
                //addActionLog(results.message)
            }
            message = action.message
            log(message)
            this._curCharacter._curAP = this._curCharacter.curAP - 1
        }

        return(message)
    }

}

