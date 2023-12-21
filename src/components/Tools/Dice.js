import DiceBox from "@3d-dice/dice-box";
import OUTCOME from '../../Enums/OutcomeEnum';
import { log } from '../Debugger';


//https://fantasticdice.games/docs/intro
/*  --------------- DICE BOX -------------- */
// Note the dice-box assets in the public folder.
// Those files are all necessary for the web workers to function properly

const Dice = new DiceBox(
    "#dice-box", // target DOM element to inject the canvas for rendering
    { 
        id: "dice-canvas", // canvas element id
        assetPath: process.env.PUBLIC_URL + "/assets/dice-box/",
        startingHeight: 8,
        throwForce: 6,
        spinForce: 5,
        lightIntensity: 0.9,
        theme: "default"
    }
);

function readRoll(results, modifiers) {
    let rolls = []
    let total = 0

    log("Reading Roll: ")
    log("results In: ", results)
    log("modifiers in: ", modifiers)

    //TODO: results is actually an array of roll groups. Probably should parse all groups but may not need to for some time
    //TODO: Somtimes a dice lands cocked and its value is undefined. dicebox handles rerolls. figure it out
    // https://fantasticdice.games/docs/usage/methods#reroll
    //results.forEach()
    results[0].rolls.forEach((roll) => {
        rolls.push(roll.value)
        total+= roll.value
    })
    return determineSuccess({ "rollTotal":results[0].value, "rolls":rolls, "modifiers":modifiers, "total":total + modifiers.total})
}

function determineSuccess(rollResults) {
    let total = rollResults.rollTotal + rollResults.modifiers.total

    switch (true) {
        case total >= 12:
            rollResults.outcome = OUTCOME.CRITICAL_SUCCESS
            break
        case total >= 10 && total < 12:
            rollResults.outcome = OUTCOME.SUCCESS
            break
        case total >= 7 && total < 10:
            rollResults.outcome = OUTCOME.PARTIAL_SUCCESS
            break
        case total >= 2 && total < 7:
            rollResults.outcome = OUTCOME.FAILURE
            break
        default:
            rollResults.outcome = OUTCOME.CRITFAIL
            //case: total < 2

    }

    return rollResults
}

export { Dice, readRoll };
