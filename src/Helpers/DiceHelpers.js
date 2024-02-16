import { OUTCOMES } from '../Enums';
import * as SETTINGS from '../GameSettings';
import { CartesianProductGenerator } from './MiscHelpers';
import { log } from '../components/Debugger';

export function getNotadedDice() {
    let numDice = SETTINGS.NUM_STARTING_DICE
    let diceSize = SETTINGS.STARTING_DICE_SIZE
    let extraDice = ''
    let initialDice = `${numDice}d${diceSize}`
    //Use this space to modify the initial dice or to check for and add extra dice (e.g. +1d4)
    return initialDice + extraDice
}

export function getDiceArray() {
    let numDice = SETTINGS.NUM_STARTING_DICE
    let diceSize = SETTINGS.STARTING_DICE_SIZE
    // diceSize++
    return { [diceSize]: numDice }
}


export function processRolls(results, modifiers) {
    let allRolls =[]
    results.forEach((rollSet)=>{
        rollSet.rolls.forEach((roll)=>{
            allRolls.push(roll.value)
        })
    })

    log("All Rolls: ", allRolls)
    // results[0].rolls.forEach((roll) => {
        // rolls.push(roll.value)
        // total += roll.value
    // })

    //TODO: results is actually an array of roll groups. Probably should parse all groups but may not need to for some time
    //TODO: Somtimes a dice lands cocked and its value is undefined. dicebox handles rerolls. figure it out
    // https://fantasticdice.games/docs/usage/methods#reroll
    return readRolls(allRolls, modifiers)
}

export function readRolls(rolls, modifiers) {
    // log(`Rolls: ${rolls} modifer: ${modifiers}`)
    let total = rolls.reduce((partialSum, nextVal) => partialSum + nextVal, 0)
    // log("Total: ", total)
    let rollResults = {
        rollTotal: total,
        rolls: rolls,
        modifiers: modifiers,
        total: total + modifiers.total
    }
    return determineSuccess(rollResults)
}

export function determineSuccess(rollResults) {
    switch (true) {
        case rollResults.total >= SETTINGS.OUTCOME_THRESHOLDS.CRITICAL_SUCCESS:
            rollResults.outcome = OUTCOMES.CRITICAL_SUCCESS
            break
        case rollResults.total >= SETTINGS.OUTCOME_THRESHOLDS.SUCCESS && rollResults.total < SETTINGS.OUTCOME_THRESHOLDS.CRITICAL_SUCCESS:
            rollResults.outcome = OUTCOMES.SUCCESS
            break
        case rollResults.total >= SETTINGS.OUTCOME_THRESHOLDS.PARTIAL_SUCCESS && rollResults.total < SETTINGS.OUTCOME_THRESHOLDS.SUCCESS:
            rollResults.outcome = OUTCOMES.PARTIAL_SUCCESS
            break
        case rollResults.total >= SETTINGS.OUTCOME_THRESHOLDS.FAILURE && rollResults.total < SETTINGS.OUTCOME_THRESHOLDS.PARTIAL_SUCCESS:
            rollResults.outcome = OUTCOMES.FAILURE
            break
        default:
            rollResults.outcome = OUTCOMES.CRITFAIL
        //case: rollResults.total < 2

    }

    return rollResults
}

export function calculateRollProbabilities() {
    let rawResults = { Failure: 0, Partial: 0, Success: 0 }
    let numRolls = 0
    let dice = getDiceArray()
    // log("checking dice: ", dice)
    let newDiceList = []
    for (const [diceSides, numDice] of Object.entries(dice)) {
        // log("Dice sides: ", diceSides)
        // log("Num dice: ", numDice)
        for (let i = 0; i < numDice; i++) {
            // let newDie = Array.from(Array(diceSides).keys())
            let newDie = Array.from({ length: diceSides }, (_, i) => i + 1)
            // log("New die", newDie)
            newDiceList.push(newDie)
        }
    }
    // log("checking new dice: ", newDiceList)
    let cartesianProductIterator = CartesianProductGenerator(...newDiceList)
    let result = cartesianProductIterator.next()
    // log("Cartesian Product: ")
    // let LIMIT = 20
    // while (!result.done && numRolls <= LIMIT) {
    while (!result.done) {
        // console.log(result.value);
        let rollResult = readRolls(result.value, { total: 0 })
        // let rollSum = result.value.reduce((partialSum, nextVal) => partialSum + nextVal, 0)
        // let roll = {rollTotal: rollSum, modifiers:0}
        // roll = DICEHELPERS.DetermineSuccess(roll)
        switch (true) {
            case (rollResult.outcome === OUTCOMES.CRITICAL_FAILURE || rollResult.outcome === OUTCOMES.FAILURE):
                rawResults.Failure++
                break
            case (rollResult.outcome === OUTCOMES.PARTIAL_SUCCESS):
                rawResults.Partial++
                break
            case (rollResult.outcome === OUTCOMES.SUCCESS || rollResult.outcome === OUTCOMES.CRITICAL_SUCCESS):
                rawResults.Success++
                break
            default:
                log("ERROR: PROBLEM GETTING ROLL OUTCOME")
                log("Errored Roll: ", rollResult)

        }
        numRolls++
        result = cartesianProductIterator.next();
    }
    // log("Raw Results: ", rawResults)
    let probabilites = {
        Failure: Math.round((((rawResults.Failure / numRolls) * 100) + Number.EPSILON) * 100) / 100,
        Partial: Math.round((((rawResults.Partial / numRolls) * 100) + Number.EPSILON) * 100) / 100,
        Success: Math.round((((rawResults.Success / numRolls) * 100) + Number.EPSILON) * 100) / 100
    }
    console.log("Probabilites: ", probabilites)
    // log("Probabilites: ", probabilites)
    return (probabilites)
}