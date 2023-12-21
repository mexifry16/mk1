import { makeAutoObservable, runInAction, when } from "mobx"
import { villageActions } from '../../Data/Actions';
import { LocationCodesEnum as LocCodes } from '../../Enums/LocationCodesEnum';
import { JSONCheatCopy } from '../../Helpers/JSONHelpers';
import ResourceHandler from './ResourceHandler';
import Character from './Character';
import Clock from './Clock';
import OUTCOME from '../../Enums/OutcomeEnum';
import { Dice, readRoll } from '../Tools/Dice'
import { log } from '../Debugger';

//TODO: Move these to new files in constants
//const RESULT = {
//    "CRITICAL_SUCCESS": "crit",
//    "SUCCESS": "success",
//    "PARTIAL_SUCCESS": "partial",
//    "FAILURE": "fail",
//    "CRITFAIL": "critfail"
//}

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

//TODO: Real dice roll functions
//function rollDice() {
//    return "success"
//}

//Dice.onRollComplete = (results) => {
//    let outcome = actionHandler.resolveRoll(results)
//};


export default class ActionHandler {
       
    //Dice.onRollComplete = (results) => {
    //    //Give results to actionHandler
    //    //TODO: if we ever roll dice for another reason it'll get processed like an action and break things
    //    //let boundResolve = actionHandler.resolveRoll.bind(actionHandler)
    //    log("Current action in game:", curAction)
    //    //let outcome = actionHandler.resolveRoll(results).bind(actionHandler)
    //    //let outcome = boundResolve(results)
    //    //log("Dice Results: ", results);
    //};

    constructor(rootStore, args) {
        //log("Constructing Action Handler")
        this.rootStore = rootStore
        this._actionList = []
        this._curAction = undefined
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
        this._rollDice = undefined

        if (args)
            Object.keys(args).forEach((key) => {
                this[`_${key}`] = args[key];
            });

        this.refreshActions()

        makeAutoObservable(this)
    }


    /***********************************************************
     *GETTERS AND SETTERS 
     */

    get curCharacter() {
        return this.rootStore.actionHandler._curCharacter
    }

    get actions() {
        return this.rootStore.actionHandler._actionList
    }

    get previewActions() {
        return this.rootStore.actionHandler._previewList
    }

    set resources(newResources) {
        this.rootStore.actionHandler._curResources = newResources
        this.rootStore.actionHandler.refreshActions()
    }

    get resources() {
        return this.rootStore.actionHandler._curResources
    }

    set curAction(actionCode) {
        this.rootStore.actionHandler._curAction = actionCode
    }

    get curAction() {
        return this.rootStore.actionHandler._curAction
    }

    /***********************************************************
     *  CUSTOM SETTERS
     */

    changeArea(location) {
        this.rootStore.actionHandler._location = location
        this.rootStore.actionHandler.refreshActions()
    }

    changeCharacter(character) {
        this.rootStore.actionHandler._curCharacter = character
        this.rootStore.actionHandler.refreshActions()
    }


    /***********************************************************
     * DICE ROLL HELPERS
     */

    async resolveRoll(results) {
        //let action = this.rootStore.actionHandler.curAction
        //let action = this.rootStore.actionHandler.actions.find((searchAction) => { return (searchAction.actionCode === this.rootStore.actionHandler.curAction) })
        let action = this.rootStore.actionHandler.curAction
        console.log(action)
        console.log("******************")
        console.log(this.rootStore.actionHandler.curAction)

        //log("Action tier: ", action.tierReq)
        let newAP = this.rootStore.actionHandler._curCharacter.curAP - action.tierReq
        this.rootStore.actionHandler._curCharacter.curAP = newAP
        //log("Remaining AP: ", newAP)

        //console.log("roll results: ", results)
        //log("Action: ", action)
        let message = `You rolled ${results[0].rolls.length}d6 and got ${results[0].value}`
        log(`You rolled ${results[0].rolls.length}d6 and got ${results[0].value}`)
        let modifiers = { total: 0 }

        if (action != undefined) {
            log("Resolving action roll")
            //this.rootStore.actionHandler._curCharacter.
            //action.statReq.forEach
            let highAttr = this.rootStore.actionHandler._curCharacter.getHighestMod(action.statReq)
            modifiers[highAttr.attr] = highAttr.mod
            modifiers.total += highAttr.mod
            //modifiers = this.rootStore.actionHandler._curCharacter.getStatModifier(action.stat)
            let diceResults = readRoll(results, modifiers)
            message = `There was an error attempting ${action.name}`
            log("Dice results: ", diceResults)
            //let result = rollDice()
            let outcome = diceResults.outcome
            let position = this.rootStore.actionHandler.determinePosition(action)
            let effect = this.rootStore.actionHandler.determineEffect(action)

            log("Outcome: ", outcome)
            let clock = action.clock
            let progress = this.rootStore.actionHandler.determineProgress(effect, outcome)
            //parse results
            switch (outcome) {
                case OUTCOME.CRITICAL_SUCCESS:
                    //double clock?
                    //other rewards?
                    clock.crit = true
                    clock.increment(progress)
                    message = "Critical Success! "
                    if (action.critMessage)
                        message += action.critMessage
                    break
                case OUTCOME.SUCCESS:
                    clock.increment(progress)
                    message = "Success! "
                    if (action.successMessage)
                        message += action.successMessage
                    break
                case OUTCOME.PARTIAL_SUCCESS:
                    clock.increment(progress)
                    //TODO: Process partial success
                    message = "Partial Success. "
                    if (action.partialMessage)
                        message += action.partialMessage
                    break
                case OUTCOME.FAILURE:
                    //TODO" Process failure
                    message = `You failed to make meaningful progress while attempting to ${action.name}`
                    if (action.failMessage)
                        message = action.failMessage
                    //Nothing BUT
                    break
                case OUTCOME.CRITFAIL:
                    //TODO: Process crit failure
                    message = `You failed spectacularly while attempting to ${action.name}`
                    if (action.critfailMessage)
                        message = action.critfailMessage
                    break
                default:
                    log(`Unrecognized result while attempting ${action.name}`)

            }
        }
        this.rootStore.actionHandler._curAction = undefined
        this.rootStore.actionHandler.refreshActions()
        log(message)
        return message
    }

    //boundResolve = (results) => {
    //    this.rootStore.actionHandler.resolveRoll.bind(this)
    //}

    //boundResolve(results){
    //    return this.rootStore.actionHandler.resolveRoll.bind(this)
    //}

    determinePosition(action) {
        let position = POSITION.CONTROLLED
        if (action.repeats == 0)
            position = POSITION.RISKY
        if (action.tierReq >= this.rootStore.actionHandler._curCharacter.tier + 1)
            position = POSITION.RISKY
        if (action.tierReq >= this.rootStore.actionHandler._curCharacter.tier + 2)
            position = POSITION.DESPERATE
        //check for action unique risks?
        //check for relevant items to bring position down
        //maybe use a tug of war system to determine position. +1s and -1s cancel each other out leaving an int somwhere for controlled, risky, desperate
        return position
    }

    determineEffect() {
        return EFFECT.STANDARD
    }


    /***********************************************************
     * CLOCK FUNCTIONS
     */

    /**
    * Takes in an action object and spits out constructor params for clocks
    * Adjustments to clock settings should happen here. Maybe move anything that might be interesting gamewide to a project settings file
    * @param {any} object
    */
    getFreshClockSettings(action) {

        let clockSettings = {}
        clockSettings.clockCode = action.actionCode
        clockSettings.segments = action.tierReq + 2
        clockSettings.repeatable = (action.repeats > 0 || action.repeats < 0) ? true : false
        clockSettings.removable = action.removable
        clockSettings.remove = this.rootStore.actionHandler.removeClock.bind(this)
        clockSettings.resolve = this.rootStore.actionHandler.resolveClock.bind(this)
        clockSettings.crit = false

        return (clockSettings)

    }

    removeClock(clockCode) {
        //resolves actions in some other manner?
        log(`Clock ${clockCode} is being removed (Action Handler)`)
    }

    resolveClock(clockCode) {
        let action = this.rootStore.actionHandler.actions.find((searchAction) => { return (searchAction.actionCode === clockCode) })

        this.rootStore.actionHandler.processRewards(action.rewards)
        if (action.clock.crit === true) {
            //process unique effects?
            this.rootStore.actionHandler.processRewards(action.rewards)
        }
        action.repeats--
        if (action.repeats === 0) {
            //remove the action
        }
        if (action.repeats != 0)
            action.clock.setClock(action)
    }

    determineProgress(effect, result) {
        let segments = 0
        switch (result) {
            case OUTCOME.CRITICAL_SUCCESS:
                if (effect === EFFECT.GREAT)
                    segments = 6
                if (effect === EFFECT.STANDARD)
                    segments = 4
                if (effect == EFFECT.LIMITED)
                    segments = 2
                break
            case OUTCOME.SUCCESS:
                if (effect === EFFECT.GREAT)
                    segments = 3
                if (effect === EFFECT.STANDARD)
                    segments = 2
                if (effect == EFFECT.LIMITED)
                    segments = 1
                break
            case OUTCOME.PARTIAL_SUCCESS:
                if (effect === EFFECT.GREAT)
                    segments = 3
                if (effect === EFFECT.STANDARD)
                    segments = 2
                if (effect == EFFECT.LIMITED)
                    segments = 1
                break
            case OUTCOME.FAIL:
                segments = 0
                break
            case OUTCOME.CRITFAIL:
                segments = 0
                break
            default:

        }
        return segments
    }


    /***********************************************************
     * ACTION PROCESSING
     */

    //const rollDice = (notation, ) => {
    //    Dice.show().roll(notation);
    //    //curAction = actionCode
    //    //log("curaction: ", curAction)
    //};

    //rollDice(notation) {
    //    Dice.show().roll(notation);
    //    //let outcome = Dice.onRollComplete((results) => {return this.rootStore.actionHandler.resolveRoll(results) })
    //}

    //prepAction(actionCode) {

    //}

    //resolveAction(actionCode) {

    //}

    //attemptAction(actionCode) {
    //    //reduce AP



    //    let action = this.rootStore.actionHandler._actionList.find((searchAction) => { return (searchAction.actionCode === actionCode) })
    //    let message = `There was an error attempting ${action.name}`
    //    //let outcome = {}
    //    log(`Attempting ${action.name}`)
    //    if (action != undefined) {

    //        this.rootStore.actionHandler._curAction = action.actionCode
    //        //this.rootStore.actionHandler.curAction = action.actionCode
    //        log("Current Action: ", this.rootStore.actionHandler.curAction)
    //        log("Current AP: ", this.rootStore.actionHandler._curCharacter.curAP)
    //        log("Action tier: ", action.tierReq)
    //        let newAP = this.rootStore.actionHandler._curCharacter.curAP - action.tierReq
    //        this.rootStore.actionHandler._curCharacter.curAP = newAP
    //        log("Remaining AP: ", newAP)
    //        this.rootStore.actionHandler.rollDice(["2d6"], action.actionCode)

    //        //Otherwise we lose context of "this" when we pass resolveRoll() to this dice callback
    //        let boundResolve = this.rootStore.actionHandler.resolveRoll.bind(this)

    //        Dice.onRollComplete = (results) => {
    //            boundResolve(results)
    //        }

            
    //    }
    //    this.rootStore.actionHandler.refreshActions()
    //    if (action === undefined) {
    //        log("Action cannot be found")
    //    }
    //    //outcome.message = message
    //    return message
    //}

    rest() {
        //Other stuff that happens during rests goes here (e.g. advancing  clocks)
        this.rootStore.actionHandler._curCharacter.rest()
        this.rootStore.actionHandler.refreshActions()

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
                    this.rootStore.actionHandler._curResources.addWood(newResource)
                    break;
                case "coin":
                    log("adding coins")
                    this.rootStore.actionHandler._curResources.addCoins(newResource)
                    break;
                default:
                    log("Resource Not Accounted For : ", resource)
            }
            //addActionLog(results.message)
        }
    }


    /***********************************************************
    * ACTION MONITORING
    * */

    getActionByCode(actionCode) {
        return this.rootStore.actionHandler._actionList.find((action) => { return (action.actionCode === actionCode) })
    }

    refreshActions() {
        log("current Actions: ", this.rootStore.actionHandler._actionList)
        log("refreshing actions")
        this.rootStore.actionHandler.refreshAvailability()
        let newActions = []

        //Get all area actions
        let refreshedActions = this.rootStore.actionHandler.getActionsByLocation(this.rootStore.actionHandler._curLocation)
        log("location filter: ", refreshedActions)

        //Filter by eligibility
        refreshedActions = this.rootStore.actionHandler.filterActionsByCharacter(this.rootStore.actionHandler._curCharacter, refreshedActions)
        log("character filter: ", refreshedActions)

        //Compare against existing actions
        refreshedActions.forEach((mysteryAction) => {
            log(`Searching for ${mysteryAction.name}`)
            let matchedAction = this.rootStore.actionHandler._actionList.find((existingAction) => { return (existingAction.actionCode === mysteryAction.actionCode) })
            log("match: ")
            console.log(matchedAction)
            if (matchedAction === undefined) {
                log(`New action ${mysteryAction.name}`)
                let newAction = JSONCheatCopy(mysteryAction)
                newAction.clock = new Clock(this.rootStore.actionHandler.getFreshClockSettings(newAction))
                log("new clock")
                log("type of resolve: ", typeof (newAction.clock.resolve))
                newActions.push(newAction)
            }
        })
        if (newActions.length > 0)
            log("New actions added: ", newActions)

        if (newActions.length <= 0)
            log("No new actions added: ")

        //each unmatch action COPY into eligible actions
        //Attach a clock

        this.rootStore.actionHandler._actionList = this.rootStore.actionHandler._actionList.concat(newActions)
    }

    refreshAvailability() {
        this.rootStore.actionHandler._actionList.forEach((action) => {
            action.disabled = !this.rootStore.actionHandler.actionAvailable(this.rootStore.actionHandler._curCharacter, action)
        })
    }

    actionAvailable(character, action) {
        let available = true

        //Check tier
        if (character.tier < action.tierReq)
            available = false

        if (available && character.curAP < action.tierReq) {
            log(`(${character.curAP}/${action.tierReq})Not enough AP to do ${action.name}`)
            available = false
        }
        

        //Check resources
        if (available && action.resourceReq.length > 0) {
            //log("Checking resources")
            for (const [resourceName, requirement] of Object.entries(action.resourceReqs)) {
                if (this.rootStore.actionHandler._curResources[resourceName] < requirement) {
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
                let item = this.rootStore.actionHandler._curCharacter.inventory.get(action.itemReq[itemIndex])
                //log("item found: ", item)
                //if we don't find an item stop looking
                if (item === undefined)
                    itemsFound = false //TODO: I don't like doing this.rootStore.actionHandler. Come up with a better loop condition
                //if(item != undefined && item.quantity > 0)
                itemIndex++
            }
            available = itemsFound
        }
        //log(`${action.name} is ${available ? "available" : "unavailable"}`)
        return available
    }

    getActionsByLocation(location) {
        let areaList = []
        let filterLocation = this.rootStore.actionHandler._curLocation
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
            if (this.rootStore.actionHandler.actionAvailable(character, action))
                eligibleActions.push(action)
            //else
            //ineligibleActions.push(action)
        })

        //this.rootStore.actionHandler._ineligibleActions = ineligibleActions //maybe this shouldn't get set here
        return eligibleActions

    }

}


//addActionClock(actionIndex) {
//    let action = this.rootStore.actionHandler._actionList[actionIndex]

//    let clock = new Clock({
//        "name": action.name,
//        "segments": action.tierReq + 3,
//        "repeatable": action.repeats < 0 ? true : false,
//        //"effects: parseEffects(), //TODO: Parse effects into a displayable string
//        //"resolve": this.rootStore.actionHandler.doAction
//    })

//    this.rootStore.actionHandler._actionClocks.push(clock)
//    log(`Clock ${clock.name} added`)

//}


//refreshActionsOLD() {
//    //Get all area actions
//    //Compare against existing actions
//    //Filter by eligibility
//    //COPY each eligible object
//    //Attach a clock

//    log("refreshing actions")
//    let refreshedActions = this.rootStore.actionHandler.getActionsByLocation(this.rootStore.actionHandler._curLocation)
//    refreshedActions = this.rootStore.actionHandler.filterActionsByCharacter(this.rootStore.actionHandler._curCharacter, refreshedActions)

//    //Check unavailable actions
//    //refreshedList.concat(refreshUnavailableActions())
//    this.rootStore.actionHandler._actionList = refreshedActions
//    //refresh clocks
//    //this.rootStore.actionHandler._actionList.forEach((action) => {
//    //    let match = this.rootStore.actionHandler.getClockByName(action.name)
//    //    if (match) {
//    //        //do nothing
//    //        log("match found")
//    //    }
//    //    if (!match) {
//    //        //create clock
//    //    }
//    //})
//}


////obsolete
//doAction(actionIndex) {
//    //TODO: spin out resting into its own thing. Not an action.
//    log("Doing Action (Action Handler)")
//    let action = this.rootStore.actionHandler._actionList[actionIndex]
//    let message = "You do not have enough AP to do that action"
//    let skipSwitch = false

//    //Handle resting here so we don't spend AP
//    if ("rest" in action.outcomes) {
//        this.rootStore.actionHandler._curCharacter.rest()
//        message = action.message
//        log(action.message)
//        skipSwitch = true
//    }

//    if (this.rootStore.actionHandler._curCharacter.curAP > 0 && !skipSwitch) {
//        log("You have enough AP")
//        let result = rollDice()

//        //parse results
//        switch (result) {
//            case OUTCOME.CRITICAL_SUCCESS:
//                //double clock?
//                //other rewards?
//                break
//            case OUTCOME.SUCCESS:
//                //you get clock
//                //let clock = this.rootStore.actionHandler.getClockByName(action.name)
//                //let results = availbleActions[actionIndex]
//                for (const [resource, value] of Object.entries(action.effect)) {
//                    switch (resource) {
//                        case "wood":
//                            log("adding wood")
//                            this.rootStore.actionHandler._curResources.addWood(value)
//                            break;
//                        case "coin":
//                            log("adding coins")
//                            this.rootStore.actionHandler._curResources.addCoins(value)
//                            break;
//                        default:
//                            log("Resource Not Accounted For : ", resource)
//                    }
//                    //addActionLog(results.message)
//                }
//                message = action.message
//                break
//            case OUTCOME.PARTIAL_SUCCESS:
//                //you get clock BUT (change of "BUT" increases by tier)
//                break
//            case OUTCOME.FAILURE:
//                //Nothing BUT
//                break
//            default:
//                //THIS IS THEORETICALLY IMPOSSIBLE
//                break


//        }


//        log(message)
//        this.rootStore.actionHandler._curCharacter._curAP = this.rootStore.actionHandler._curCharacter.curAP - 1
//    }

//    return (message)
//}

///**
// * 
// * @param {any} actionIndex
// */
//resolveAction(actionIndex) {
//    //TODO: Make it take the actionCode instead of the index
//    log("Resolving Action Clock")
//    let action = this.rootStore.actionHandler._actionList[actionIndex]
//    let message = "You do not have enough AP to do that action"
//    let skipSwitch = false

//    for (const [resource, value] of Object.entries(action.effect)) {
//        switch (resource) {
//            case "wood":
//                log("adding wood")
//                this.rootStore.actionHandler._curResources.addWood(value)
//                break;
//            case "coin":
//                log("adding coins")
//                this.rootStore.actionHandler._curResources.addCoins(value)
//                break;
//            default:
//                log("Resource Not Accounted For : ", resource)
//        }
//    }
//    message = action.message
//    log(message)
//    this.rootStore.actionHandler._curCharacter._curAP = this.rootStore.actionHandler._curCharacter.curAP - 1

//    return (message)
//}