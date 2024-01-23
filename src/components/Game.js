import { useEffect, useState, useRef } from 'react';
import { observer } from "mobx-react-lite"
import { autorun, configure } from "mobx"
import { Stack, Button, Typography } from '@mui/material';
import DiceBox from "@3d-dice/dice-box";
import { readRoll } from "./Tools/Dice";
import DisplayResults from "@3d-dice/dice-ui/src/displayResults";
import AdvancedRoller from "@3d-dice/dice-ui/src/advancedRoller";
import BoxControls from "@3d-dice/dice-ui/src/boxControls";
import Character from './Models/Character';
import ActionHandler from './Models/ActionHandler';
import ResourceHandler from './Models/ResourceHandler';
import ShopHandler from './Models/ShopHandler';
import { GAMEHELPERS } from '../Helpers/GameHelpers';
import MainScreen from './MainScreen';
import { RESOURCES } from '../Enums';
import { Debugger, log, LOGGING_ENABLED, DEBUGGING_ENABLED } from './Debugger'

/*
* Primary library for rendering traditional js classes reactively
* https://mobx.js.org/README.html 
* */

/******************************************************
 * Dice Initializers
 ******************************************************/

const diceJar =
    new DiceBox(
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
    )

document.addEventListener("DOMContentLoaded", async () => {
    //log("********************************************")
    //log("Asset Path:")
    //log(Dice.assetPath)
    diceJar.init().then(() => {
        // clear dice on click anywhere on the screen
        document.addEventListener("mousedown", () => {
            const diceBoxCanvas = document.getElementById("dice-canvas");
            if (window.getComputedStyle(diceBoxCanvas).display !== "none") {
                diceJar.hide()
                //Dice.clear()
                //DiceResults.clear();
            }
        });
    });
})

export default function Game() {
    //TODO: this file should hold the logic that bings the handlers together rather than any of the handlers seeing each other
    //TODO: ADD A MASTER DISABLE FLAG FOR ANYTHING THAT MIGHT NEED TO WAIT (ROLLING DICE NEEDS TO WAIT FOR LOADING ASSETS AND TO WAIT FOR EXISTING DICE TO FINISH ROLLING)
    //Set up resource stores 
    const [playerLog, setPlayerLog] = useState([]);
    const [actionHandler] = useState(new ActionHandler());
    const [resourceHandler] = useState(new ResourceHandler());
    const [curCharacter] = useState(new Character({ name: "Billy Wigglestick" }));
    const [shopHandler] = useState(new ShopHandler(resourceHandler, curCharacter));
    const [curLocation, setCurLocation] = useState("Village");
    //const [gameDate, setGameDate] = useState(0);

    useEffect(() => {
        shopHandler.setCurShop("htg")
    }, [])


    /******************************************************
    * DICE HANDLERS
    ******************************************************/
    const rollDice = (notatedDice) => {
        diceJar.show().roll(notatedDice);
    }

    diceJar.onRollComplete = (results) => {
        //TODO: Handle other reasons to roll the dice here

        let message = `You rolled ${results[0].rolls.length}d6 and got ${results[0].value}`
        log(message)
        let modifiers = { total: 0 }
        let highAttr = undefined
        let action = actionHandler.curAction
        let outcome = undefined

        if (action != undefined) {
            message = `There was an error attempting ${action.name}`
            highAttr = curCharacter.getHighestMod(action.statReq)
            modifiers[highAttr.attr] = highAttr.mod
            modifiers.total += highAttr.mod

            let diceResults = readRoll(results, modifiers)
            log("Dice results: ", diceResults)

            let outcome = diceResults.outcome
            let position = GAMEHELPERS.determinePosition(action, curCharacter)
            let effect = GAMEHELPERS.determineEffect(action)
            boundResolve(results, effect, outcome)
                .then((outcome) => {
                    //TODO: This log gets overwridden by the next one when an action complete
                    //Maybe this is fine? Probably I want both messages
                    //both values should be sent to addPlayerlog at the same time to ensure both updates happen
                    addPlayerLog(outcome.message)
                    return outcome
                })
                .then((outcome) => {
                    if (outcome.actionComplete === true) {
                        actionHandler.resolveAction(action)
                        processRewards(action.rewards)
                        addPlayerLog(action.message)
                    }
                })
            //TODO: Process the outcome. display some messages
            //addPlayerLog
        }
        //log("Dice Results: ", results);
        //log("Outcome: ", outcome)
    }


    /******************************************************
     * Game Logic
     ******************************************************/
    function initGame() {

    }

    function changeLocation() {

    }

    function rest(){
        curCharacter.rest()
        //move world state forward
    }

    function speakTo(npc) {

    }

    function attemptAction(action) {
        actionHandler.curAction = action
        //setup dice
        let dice = 2
        let notatedDice = `${dice}d6`
        rollDice(notatedDice)
        //reduce AP
        curCharacter.curAP = curCharacter.curAP - action.tier
        actionHandler.refreshActions()
    }

    function completeAction() {

    }

    function skillCheck() {

    }

    function addResource() {

    }

    function changeShop() {

    }

    function buyItem() {

    }

    function advanceQuest() {

    }

    function addQuestToJournal() {

    }

    function processRewards(rewards) {
        //log("rewards: ", JSON.stringify(rewards))
        let multiplier = 1
        //multiplier = getMultiplier() //Maybe search the character for relevant items/perks?
        for (const [resource, value] of Object.entries(rewards)) {
            log(`resource:${resource}, value:${value}}`)
            let newResource = value * multiplier
            switch (resource) {
                case RESOURCES.WOOD:
                    log("adding wood")
                    resourceHandler.addWood(newResource)
                    break;
                case RESOURCES.COINS:
                    log("adding coins")
                    resourceHandler.addCoins(newResource)
                    break;
                default:
                    log("Resource Not Accounted For : ", resource)
            }
            //addActionLog(results.message)
        }
    }

    async function addPlayerLog(message) {
        let newLog = [...playerLog]
        //The outcomes returned by resolve roll are promises. This seems like the only place to wait for the to resolve or I end up with an array of promises instead of messages for the action log
        let newMessage = await message
        log("New Message Added:::::::::::::::::::::::::::::")
        log(newMessage)
        newLog.unshift(newMessage)
        log(newLog)
        setPlayerLog(newLog)
    }

    /******************************************************
     * HELPERS
     ******************************************************/
    function isActionDisabled(action) {
        let disabled = false
        //Check tier
        if (curCharacter.tier < action.tier)
            disabled = true

        if (!disabled && curCharacter.curAP < action.tier) {
            //log(`(${curCharacter.curAP}/${action.tier})Not enough AP to do ${action.name}`)
            disabled = true
        }

        //Check resources
        if (!disabled && action.resourceReq.length > 0) {
            //log("Checking resources")
            for (const [resourceName, requirement] of Object.entries(action.resourceReqs)) {
                if (resourceHandler[resourceName] < requirement) {
                    disabled = true
                }
            }
        }

        //Check Items
        //TODO: Convert to checking for a minimum number of item tags rather than specific items
        if (!disabled && action.itemReq.length > 0) {
            //log("checking items")
            let itemsFound = true
            let itemIndex = 0
            //Loop through the item reqs
            while (itemsFound && itemIndex < action.itemReq.length) {
                let item = curCharacter.inventory.get(action.itemReq[itemIndex])
                //log("item found: ", item)
                //if we don't find an item stop looking
                if (item === undefined)
                    itemsFound = false
                itemIndex++
            }
            disabled = !itemsFound
        }
        //log(`${action.name} is ${available ? "available" : "unavailable"}`)
        return disabled
    }

    /******************************************************
     * DATA BINDING AND DEBUGGING
     ******************************************************/

    const boundResolve = actionHandler.resolveRoll.bind(actionHandler)

    //Bind resource stores to main component via an observer (mobx)
    const GameView = observer(({ resourceHandler, actionHandler, curCharacter, shopHandler }) => {
        var view = <></>

        if (DEBUGGING_ENABLED) {
            view = <Debugger
                resourceHandler={resourceHandler}
                actionHandler={actionHandler}
                curCharacter={curCharacter}
                shopHandler={shopHandler}
                curLocation={curLocation}
                playerLog={playerLog}
                log={log}
                children={
                    <MainScreen
                        resourceHandler={resourceHandler}
                        actionHandler={actionHandler}
                        curCharacter={curCharacter}
                        shopHandler={shopHandler}
                        curLocation={curLocation}
                        log={log}
                        attemptAction={attemptAction}
                        playerLog={playerLog}
                        isActionDisabled={isActionDisabled}
                        rest={rest}
                    />
                }
            />
        }

        if (!DEBUGGING_ENABLED) {
            view = <MainScreen
                resourceHandler={resourceHandler}
                actionHandler={actionHandler}
                curCharacter={curCharacter}
                shopHandler={shopHandler}
                curLocation={curLocation}
                log={log}
                playerLog={playerLog}
                attemptAction={attemptAction}
                isActionDisabled={isActionDisabled}
                rest={rest}
            />
        }
        return view
    })

    /******************************************************
     * RENDER
     ******************************************************/
    return (
        <>
            <GameView
                resourceHandler={resourceHandler}
                actionHandler={actionHandler}
                curCharacter={curCharacter}
                shopHandler={shopHandler}
                curLocation={curLocation}
                attemptAction={attemptAction}
                playerLog={playerLog}
                isActionDisabled={isActionDisabled}
                rest={rest}
            />
            {/*<div ref={diceBoxRef} id="dice-box"></div>*/}
        </>
    )

}