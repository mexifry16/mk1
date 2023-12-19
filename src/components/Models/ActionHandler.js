import { makeAutoObservable } from "mobx"
import { villageActions } from '../../Data/Actions';
import { LocationCodesEnum as LocCodes } from '../../Enums/LocationCodesEnum';
import { JSONCheatCopy } from '../../Helpers/JSONHelpers';
import ResourceHandler from './ResourceHandler';
import Character from './Character';
import Clock from './Clock';
import { log } from '../Debugger';

const RESULT = {
    "CRITICAL_SUCCESS": "crit",
    "SUCCESS": "success",
    "PARTIAL_SUCCESS": "partial",
    "FAILURE": "fail",
    "CRITFAIL": "critfail"
}

const EFFECT = {
    "GREAT": "great",
    "STANDARD": "standard",
    "LIMITED": "limited",
}

const POSITION = {
    "CONTROLLED": "controlled",
    "RISKY": "risky",
    "DESPERATE": "desperate"
}

function rollDice() {
    return "success"
}

export default class ActionHandler {


    constructor(args) {
        //log("Constructing Action Handler")
        this._actionList = []
        //this._ineligibleActions = []
        //this._actionClocks = []
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

    determinePosition(action) {
        let position = POSITION.CONTROLLED
        if (action.repeats == 0)
            position = POSITION.RISKY
        if (action.tierReq >= this._curCharacter.tier + 1)
            position = POSITION.RISKY
        if (action.tierReq >= this._curCharacter.tier + 2)
            position = POSITION.DESPERATE
        //check for action unique risks?
        //check for relevant items to bring position down
        //maybe use a tug of war system to determine position. +1s and -1s cancel each other out leaving an int somwhere for controlled, risky, desperate
        return position
    }

    determineEffect() {
        return EFFECT.STANDARD
    }

    /**
    * Takes in an action object and spits out constructor params for clocks
    * Adjustments to clock settings should happen here
    * @param {any} object
    */
    getFreshClockSettings(action) {

        let clockSettings = {}
        clockSettings.clockCode = action.actionCode
        clockSettings.segments = action.tierReq + 3
        clockSettings.repeatable = (action.repeats > 0 || action.repeats < 0) ? true : false
        clockSettings.removable = action.removable
        clockSettings.remove = this.removeClock.bind(this)
        clockSettings.resolve = this.resolveClock.bind(this)
        clockSettings.crit = false

        return (clockSettings)

    }


    refreshActions() {
        log("current Actions: ", this._actionList)
        log("refreshing actions")
        let newActions = []

        //Get all area actions
        let refreshedActions = this.getActionsByLocation(this._curLocation)
        log("location filter: ", refreshedActions)

        //Filter by eligibility
        refreshedActions = this.filterActionsByCharacter(this._curCharacter, refreshedActions)
        log("character filter: ", refreshedActions)

        //Compare against existing actions
        refreshedActions.forEach((mysteryAction) => {
            log(`Searching for ${mysteryAction.name}`)
            let matchedAction = this._actionList.find((existingAction) => { return (existingAction.actionCode === mysteryAction.actionCode) })
            log("match: ")
            console.log(matchedAction)
            if (matchedAction === undefined) {
                log(`New action ${mysteryAction.name}`)
                let newAction = JSONCheatCopy(mysteryAction)
                newAction.clock = new Clock(this.getFreshClockSettings(newAction))
                log("new clock")
                log("type of resolve: ", typeof (newAction.clock.resolve))
                newActions.push(newAction)
            }
        })
        if(newActions.length > 0)
            log("New actions added: ", newActions)

        if (newActions.length <= 0)
            log("No new actions added: ")

        //each unmatch action COPY into eligible actions
        //Attach a clock

        this._actionList = this._actionList.concat(newActions)
    }




    actionAvailable(character, action) {
        let available = true

        //Check tier
        if (character.tier < action.tierReq)
            available = false

        //Check resources
        if (available && action.resourceReq.length > 0) {
            //log("Checking resources")
            for (const [resourceName, requirement] of Object.entries(action.resourceReqs)) {
                if (this._curResources[resourceName] < requirement) {
                    available = false
                }
            }
        }

        //Check Items
        if (available && action.itemReq.length > 0) {
            //log("checking items")
            let itemsFound = true
            let itemIndex = 0
            //Loop through the item reqs
            while (itemsFound && itemIndex < action.itemReq.length) {
                let item = this._curCharacter.inventory.get(action.itemReq[itemIndex])
                //log("item found: ", item)
                //if we don't find an item stop looking
                if (item === undefined)
                    itemsFound = false //TODO: I don't like doing this. Come up with a better loop condition
                //if(item != undefined && item.quantity > 0)
                itemIndex++
            }
            available = itemsFound
        }
        //log(`${action.name} is ${available ? "available" : "unavailable"}`)
        return available
    }

    resolveClock(clockCode) {
        let action = this.actions.find((searchAction) => { return (searchAction.actionCode === clockCode) })
        
        this.processRewards(action.rewards)
        if (action.clock.crit === true) {
            //process unique effects?
            this.processRewards(action.rewards)
        }
        action.repeats--
        if (action.repeats === 0) {
            //remove the action
        }
        if (action.repeats != 0)
            action.clock.setClock(action)


    }

    processRewards(rewards, multiplier) {
        //log("rewards: ", JSON.stringify(rewards))
        log(`multiplier: ${multiplier}`)
        for (const [resource, value] of Object.entries(rewards)) {
            log(`resource:${resource}, value:${value}}`)
            let newResource = value * (multiplier ?? 1)
            switch (resource) {
                case "wood":
                    log("adding wood")
                    this._curResources.addWood(newResource)
                    break;
                case "coin":
                    log("adding coins")
                    this._curResources.addCoins(newResource)
                    break;
                default:
                    log("Resource Not Accounted For : ", resource)
            }
            //addActionLog(results.message)
        }
    }

    determineProgress(effect, result) {
        let segments = 0
        switch (result) {
            case RESULT.CRITICAL_SUCCESS:
                if (effect === EFFECT.GREAT)
                    segments = 6
                if (effect === EFFECT.STANDARD)
                    segments = 4
                if (effect == EFFECT.LIMITED)
                    segments = 2
                break
            case RESULT.SUCCESS:
                if (effect === EFFECT.GREAT)
                    segments = 3
                if (effect === EFFECT.STANDARD)
                    segments = 2
                if (effect == EFFECT.LIMITED)
                    segments = 1
                break
            case RESULT.PARTIAL_SUCCESS:
                if (effect === EFFECT.GREAT)
                    segments = 3
                if (effect === EFFECT.STANDARD)
                    segments = 2
                if (effect == EFFECT.LIMITED)
                    segments = 1
                break
            case RESULT.FAIL:
                segments = 0
                break
            case RESULT.CRITFAIL:
                segments = 0
                break
            default:

        }
        return segments
    }

    attemptAction(actionCode) {
        let action = this._actionList.find((searchAction) => { return(searchAction.actionCode === actionCode) })
        let message = `There was an error attempting ${action.name}`
        log(`Attempting ${action.name}`)
        if (action != undefined) {
            let position = this.determinePosition(action)
            let effect = this.determineEffect(action)
            if (true) { //if eligible
                let result = rollDice()

                log("result: ", result)
                let clock = action.clock
                let progress = this.determineProgress(effect, result)
                //parse results
                switch (result) {
                    case RESULT.CRITICAL_SUCCESS:
                        clock.crit = true
                        clock.increment(progress)
                        //double clock?
                        //other rewards?
                        message = "Critical Success! "
                        if (action.critMessage)
                            message += action.critMessage
                        break
                    case RESULT.SUCCESS:
                        //you get clock
                        clock.increment(progress)

                        message = "Success! "
                        if (action.critMessage)
                            message += action.successMessage
                        break
                    case RESULT.PARTIAL_SUCCESS:
                        clock.increment(progress)
                        //you get clock BUT (change of "BUT" increases by tier)
                        message = "Partial Success. "
                        if (action.critMessage)
                            message += action.partialMessage
                        break
                    case RESULT.FAILURE:
                        message = `You failed to make meaningful progress while attempting to ${action.name}`
                        if (action.critMessage)
                            message = action.failMessage
                        //Nothing BUT
                        break
                    case RESULT.CRITFAIL:
                        message = `You failed spectacularly while attempting to ${action.name}`
                        if (action.critMessage)
                            message = action.critfailMessage
                        break
                    default:
                        //THIS IS THEORETICALLY IMPOSSIBLE
                        log(`Unrecognized result while attempting ${action.name}`)
                        break


                }
            }
            log(message)
        }
        if (action === undefined) {
            log("Action cannot be found")
        }
        return message
    }

    doAction(actionIndex) {
        //TODO: spin out resting into its own thing. Not an action.
        log("Doing Action (Action Handler)")
        let action = this._actionList[actionIndex]
        let message = "You do not have enough AP to do that action"
        let skipSwitch = false

        //Handle resting here so we don't spend AP
        if ("rest" in action.outcomes) {
            this._curCharacter.rest()
            message = action.message
            log(action.message)
            skipSwitch = true
        }

        if (this._curCharacter.curAP > 0 && !skipSwitch) {
            log("You have enough AP")
            let result = rollDice()

            //parse results
            switch (result) {
                case RESULT.CRITICAL_SUCCESS:
                    //double clock?
                    //other rewards?
                    break
                case RESULT.SUCCESS:
                    //you get clock
                    //let clock = this.getClockByName(action.name)
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
                    break
                case RESULT.PARTIAL_SUCCESS:
                    //you get clock BUT (change of "BUT" increases by tier)
                    break
                case RESULT.FAILURE:
                    //Nothing BUT
                    break
                default:
                    //THIS IS THEORETICALLY IMPOSSIBLE
                    break


            }


            log(message)
            this._curCharacter._curAP = this._curCharacter.curAP - 1
        }

        return (message)
    }

    resolveAction(actionIndex) {
        log("Resolving Action Clock")
        let action = this._actionList[actionIndex]
        let message = "You do not have enough AP to do that action"
        let skipSwitch = false

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
        }
        message = action.message
        log(message)
        this._curCharacter._curAP = this._curCharacter.curAP - 1

        return (message)
    }


    removeClock(clockCode) {
        //resolves actions in some other manner?
        log(`Clock ${clockCode} is being removed (Action Handler)`)
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
        //let ineligibleActions = []
        let eligibleActions = []

        actions.forEach((action) => {
            if (this.actionAvailable(character, action))
                eligibleActions.push(action)
            //else
            //ineligibleActions.push(action)
        })

        //this._ineligibleActions = ineligibleActions //maybe this shouldn't get set here
        return eligibleActions

    }

}


//addActionClock(actionIndex) {
//    let action = this._actionList[actionIndex]

//    let clock = new Clock({
//        "name": action.name,
//        "segments": action.tierReq + 3,
//        "repeatable": action.repeats < 0 ? true : false,
//        //"effects: parseEffects(), //TODO: Parse effects into a displayable string
//        //"resolve": this.doAction
//    })

//    this._actionClocks.push(clock)
//    log(`Clock ${clock.name} added`)

//}


//refreshActionsOLD() {
//    //Get all area actions
//    //Compare against existing actions
//    //Filter by eligibility
//    //COPY each eligible object
//    //Attach a clock

//    log("refreshing actions")
//    let refreshedActions = this.getActionsByLocation(this._curLocation)
//    refreshedActions = this.filterActionsByCharacter(this._curCharacter, refreshedActions)

//    //Check unavailable actions
//    //refreshedList.concat(refreshUnavailableActions())
//    this._actionList = refreshedActions
//    //refresh clocks
//    //this._actionList.forEach((action) => {
//    //    let match = this.getClockByName(action.name)
//    //    if (match) {
//    //        //do nothing
//    //        log("match found")
//    //    }
//    //    if (!match) {
//    //        //create clock
//    //    }
//    //})
//}