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
   

     //TODO: ADD A MASTER DISABLE FLAG FOR ANYTHING THAT MIGHT NEED TO WAIT (ROLLING DICE NEEDS TO WAIT FOR LOADING ASSETS AND TO WAIT FOR EXISTING DICE TO FINISH ROLLING)
    //Set up resource stores 
    const resourceHandler = new ResourceHandler()
    const curCharacter = new Character({ name: "Billy Wigglestick" })
    const actionHandler = new ActionHandler({ "curResources": resourceHandler, "curCharacter": curCharacter, rollDice: rollDice })
    const shopHandler = new ShopHandler(resourceHandler, curCharacter)
    
    const [diceRolling, setDiceRolling] = useState(false)
    const [curLocation, setCurLocation] = useState("Village")
    const [gameDate, setGameDate] = useState(0)
    
    const boundResolve = actionHandler.resolveRoll.bind(actionHandler)

    useEffect(() => {
        shopHandler.setCurShop("htg")
    }, [])


    /******************************************************
     * Game Logic
     ******************************************************/

    function initGame(){

    }
    //async function addActionLog(message) {
    //    let newLog = [...actionLog]
    //    //The outcomes returned by resolve roll are promises. This seems like the only place to wait for the to resolve or I end up with an array of promises instead of messages for the action log
    //    let newMessage = await message
    //    log("New Message AddedL:::::::::::::::::::::::::::::")
    //    log(newMessage)
    //    newLog.unshift(newMessage)
    //    log(newLog)
    //    setActionLog(newLog)
    //}

  

    function attemptAction(action) {
        actionHandler.curAction = action
        //setup dice
        let dice = 2
        let notadedDice = `${dice}d6`
        rollDice(notadedDice)
        //reduce AP
        curCharacter.curAP = curCharacter.curAP - action.tierReq
        actionHandler.refreshActions()
    }

    /******************************************************
     * DATA BINDING AND DEBUGGING
     ******************************************************/

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
                        //actionLog={actionLog}
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
                attemptAction={attemptAction}
                //actionLog={actionLog}
            />
        }
        return view
    })

    /******************************************************
     * DICE HANDLERS
     ******************************************************/

    const rollDice = (notatedDice)=>{
        diceJar.show().roll(notatedDice);
    }
    // function rollDice (notatedDice){
        
    // }

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
            outcome = boundResolve(results, effect, outcome)
            //addActionLog(outcome)
            //TODO: Process the outcome. display some messages

        }
        //log("Dice Results: ", results);
        //log("Outcome: ", outcome)
    };

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
                //actionLog={actionLog}
            />
            {/*<div ref={diceBoxRef} id="dice-box"></div>*/}
        </>
    )

}