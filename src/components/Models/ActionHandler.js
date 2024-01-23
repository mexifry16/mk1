import { makeAutoObservable, runInAction, when } from "mobx"
import { villageActions } from '../../Data/Actions';
import { LOCATION_CODES } from '../../Enums';
import { JSONCheatCopy } from '../../Helpers/JSONHelpers';
import ResourceHandler from './ResourceHandler';
import Character from './Character';
import Clock from './Clock';
import { OUTCOMES, POSITIONS, EFFECTS}  from '../../Enums';
import { Dice, readRoll } from '../Tools/Dice'
import { log } from '../Debugger';

export default class ActionHandler {
   
    constructor(args) {
        //log("Constructing Action Handler")
        //this.rootStore = rootStore
        this._actionList = []
        this._actionLog = []
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

    set curAction(actionCode) {
        this._curAction = actionCode
    }

    get curAction() {
        return this._curAction
    }

    get actionLog() {
        return this._actionLog
    }

    /***********************************************************
     *  CUSTOM SETTERS
     */

    changeArea(location) {
        this._location = location
        this.refreshActions()
    }

    changeCharacter(character) {
        this._curCharacter = character
        this.refreshActions()
    }


    /***********************************************************
     * DICE ROLL HELPERS
     */

    

    //boundResolve = (results) => {
    //    this.resolveRoll.bind(this)
    //}

    //boundResolve(results){
    //    return this.resolveRoll.bind(this)
    //}

    determinePosition(action) {
        let position = POSITIONS.CONTROLLED
        if (action.repeats == 0)
            position = POSITIONS.RISKY
        if (action.tierReq >= this._curCharacter.tier + 1)
            position = POSITIONS.RISKY
        if (action.tierReq >= this._curCharacter.tier + 2)
            position = POSITIONS.DESPERATE
        //check for action unique risks?
        //check for relevant items to bring position down
        //maybe use a tug of war system to determine position. +1s and -1s cancel each other out leaving an int somwhere for controlled, risky, desperate
        return position
    }

    determineEffect() {
        return EFFECTS.STANDARD
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
        clockSettings.remove = this.removeClock.bind(this)
        clockSettings.resolve = this.resolveClock.bind(this)
        clockSettings.crit = false

        return (clockSettings)

    }

    removeClock(clockCode) {
        //resolves actions in some other manner?
        log(`Clock ${clockCode} is being removed (Action Handler)`)
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

    determineProgress(effect, result) {
        let segments = 0
        switch (result) {
            case OUTCOMES.CRITICAL_SUCCESS:
                if (effect === EFFECTS.GREAT)
                    segments = 6
                if (effect === EFFECTS.STANDARD)
                    segments = 4
                if (effect == EFFECTS.LIMITED)
                    segments = 2
                break
            case OUTCOMES.SUCCESS:
                if (effect === EFFECTS.GREAT)
                    segments = 3
                if (effect === EFFECTS.STANDARD)
                    segments = 2
                if (effect == EFFECTS.LIMITED)
                    segments = 1
                break
            case OUTCOMES.PARTIAL_SUCCESS:
                if (effect === EFFECTS.GREAT)
                    segments = 3
                if (effect === EFFECTS.STANDARD)
                    segments = 2
                if (effect == EFFECTS.LIMITED)
                    segments = 1
                break
            case OUTCOMES.FAIL:
                segments = 0
                break
            case OUTCOMES.CRITFAIL:
                segments = 0
                break
            default:

        }
        return segments
    }


    /***********************************************************
     * ACTION PROCESSING
     */


    async resolveRoll(results, effect, outcome) {
        //let action = this.curAction
        //let action = this.actions.find((searchAction) => { return (searchAction.actionCode === this.curAction) })
        let action = this.curAction
        //console.log(action)
        //console.log("******************")
        //console.log(this.curAction)

        //log("Action tier: ", action.tierReq)
        //let newAP = this._curCharacter.curAP - action.tierReq
        //this._curCharacter.curAP = newAP
        //log("Remaining AP: ", newAP)

        //console.log("roll results: ", results)
        //log("Action: ", action)
        let message = `You rolled ${results[0].rolls.length}d6 and got ${results[0].value}`
        //log(`You rolled ${results[0].rolls.length}d6 and got ${results[0].value}`)
        //let modifiers = { total: 0 }

        if (action != undefined) {
            log("Resolving action roll")
            //this._curCharacter.
            //action.statReq.forEach
            //let highAttr = this._curCharacter.getHighestMod(action.statReq)
            //modifiers[highAttr.attr] = highAttr.mod
            //modifiers.total += highAttr.mod
            //modifiers = this._curCharacter.getStatModifier(action.stat)
            //let diceResults = readRoll(results, modifiers)
            //message = `There was an error attempting ${action.name}`
            //log("Dice results: ", diceResults)
            //let result = rollDice()
            //let outcome = diceResults.outcome
            //let position = this.determinePosition(action)
            //let effect = this.determineEffect(action)

            log("Outcome: ", outcome)
            let clock = action.clock
            let progress = this.determineProgress(effect, outcome)
            //parse results
            switch (outcome) {
                case OUTCOMES.CRITICAL_SUCCESS:
                    //double clock?
                    //other rewards?
                    clock.crit = true
                    clock.increment(progress)
                    message = "Critical Success! "
                    if (action.critMessage)
                        message += action.critMessage
                    break
                case OUTCOMES.SUCCESS:
                    clock.increment(progress)
                    message = "Success! "
                    if (action.successMessage)
                        message += action.successMessage
                    break
                case OUTCOMES.PARTIAL_SUCCESS:
                    clock.increment(progress)
                    //TODO: Process partial success
                    message = "Partial Success. "
                    if (action.partialMessage)
                        message += action.partialMessage
                    break
                case OUTCOMES.FAILURE:
                    //TODO" Process failure
                    message = `You failed to make meaningful progress while attempting to ${action.name}`
                    if (action.failMessage)
                        message = action.failMessage
                    //Nothing BUT
                    break
                case OUTCOMES.CRITFAIL:
                    //TODO: Process crit failure
                    message = `You failed spectacularly while attempting to ${action.name}`
                    if (action.critfailMessage)
                        message = action.critfailMessage
                    break
                default:
                    log(`Unrecognized result while attempting ${action.name}`)

            }
        }
        this._curAction = undefined
        this.refreshActions()
        log(message)
        this.addActionLog(message)
    }

    //const rollDice = (notation, ) => {
    //    Dice.show().roll(notation);
    //    //curAction = actionCode
    //    //log("curaction: ", curAction)
    //};

    //rollDice(notation) {
    //    Dice.show().roll(notation);
    //    //let outcome = Dice.onRollComplete((results) => {return this.resolveRoll(results) })
    //}

    //prepAction(actionCode) {

    //}

    //resolveAction(actionCode) {

    //}

    //attemptAction(actionCode) {
    //    //reduce AP



    //    let action = this._actionList.find((searchAction) => { return (searchAction.actionCode === actionCode) })
    //    let message = `There was an error attempting ${action.name}`
    //    //let outcome = {}
    //    log(`Attempting ${action.name}`)
    //    if (action != undefined) {

    //        this._curAction = action.actionCode
    //        //this.curAction = action.actionCode
    //        log("Current Action: ", this.curAction)
    //        log("Current AP: ", this._curCharacter.curAP)
    //        log("Action tier: ", action.tierReq)
    //        let newAP = this._curCharacter.curAP - action.tierReq
    //        this._curCharacter.curAP = newAP
    //        log("Remaining AP: ", newAP)
    //        this.rollDice(["2d6"], action.actionCode)

    //        //Otherwise we lose context of "this" when we pass resolveRoll() to this dice callback
    //        let boundResolve = this.resolveRoll.bind(this)

    //        Dice.onRollComplete = (results) => {
    //            boundResolve(results)
    //        }

            
    //    }
    //    this.refreshActions()
    //    if (action === undefined) {
    //        log("Action cannot be found")
    //    }
    //    //outcome.message = message
    //    return message
    //}

    rest() {
        //Other stuff that happens during rests goes here (e.g. advancing  clocks)
        this._curCharacter.rest()
        this.refreshActions()

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

    addActionLog(message) {
        this._actionLog.unshift(message)
    }


    /***********************************************************
    * ACTION MONITORING
    * */

    getActionByCode(actionCode) {
        return this._actionList.find((action) => { return (action.actionCode === actionCode) })
    }

    refreshActions() {
        log("current Actions: ", this._actionList)
        log("refreshing actions")
        this.refreshAvailability()
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
        if (newActions.length > 0)
            log("New actions added: ", newActions)

        if (newActions.length <= 0)
            log("No new actions added: ")

        //each unmatch action COPY into eligible actions
        //Attach a clock

        this._actionList = this._actionList.concat(newActions)
    }

    refreshAvailability() {
        this._actionList.forEach((action) => {
            action.disabled = !this.actionAvailable(this._curCharacter, action)
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

    getActionsByLocation(location) {
        let areaList = []
        let filterLocation = this._curLocation
        if (location)
            filterLocation = location

        switch (filterLocation.locCode) { //TODO. how I address parts of the location and character are probably going to change
            case LOCATION_CODES.VILLAGE:
                areaList = JSONCheatCopy(villageActions)
                break;
            case LOCATION_CODES.BEACH:
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

//const actionHandler = new ActionHandler()

//export default actionHandler


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


////obsolete
//doAction(actionIndex) {
//    //TODO: spin out resting into its own thing. Not an action.
//    log("Doing Action (Action Handler)")
//    let action = this._actionList[actionIndex]
//    let message = "You do not have enough AP to do that action"
//    let skipSwitch = false

//    //Handle resting here so we don't spend AP
//    if ("rest" in action.outcomes) {
//        this._curCharacter.rest()
//        message = action.message
//        log(action.message)
//        skipSwitch = true
//    }

//    if (this._curCharacter.curAP > 0 && !skipSwitch) {
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
//                //let clock = this.getClockByName(action.name)
//                //let results = availbleActions[actionIndex]
//                for (const [resource, value] of Object.entries(action.effect)) {
//                    switch (resource) {
//                        case "wood":
//                            log("adding wood")
//                            this._curResources.addWood(value)
//                            break;
//                        case "coin":
//                            log("adding coins")
//                            this._curResources.addCoins(value)
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
//        this._curCharacter._curAP = this._curCharacter.curAP - 1
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
//    let action = this._actionList[actionIndex]
//    let message = "You do not have enough AP to do that action"
//    let skipSwitch = false

//    for (const [resource, value] of Object.entries(action.effect)) {
//        switch (resource) {
//            case "wood":
//                log("adding wood")
//                this._curResources.addWood(value)
//                break;
//            case "coin":
//                log("adding coins")
//                this._curResources.addCoins(value)
//                break;
//            default:
//                log("Resource Not Accounted For : ", resource)
//        }
//    }
//    message = action.message
//    log(message)
//    this._curCharacter._curAP = this._curCharacter.curAP - 1

//    return (message)
//}