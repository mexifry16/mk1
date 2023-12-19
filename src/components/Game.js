import { useEffect, useState, useRef } from 'react';
import { observer } from "mobx-react-lite"
import { autorun, trace, getDependencyTree, getDebugName, getObserverTree, spy } from "mobx"
import { Stack, Button, Typography } from '@mui/material';
import Character from './Models/Character';
import ActionHandler from './Models/ActionHandler';
import ResourceHandler from './Models/ResourceHandler';
import ShopHandler from './Models/ShopHandler';
import MainScreen from './MainScreen';
import { Debugger, log, LOGGING_ENABLED, DEBUGGING_ENABLED } from './Debugger'
import DiceBox from "@3d-dice/dice-box";
import DisplayResults from "@3d-dice/dice-ui/src/displayResults";
import AdvancedRoller from "@3d-dice/dice-ui/src/advancedRoller";
import BoxControls from "@3d-dice/dice-ui/src/boxControls";





export default function Game() {
    //const diceBoxRef = useRef(null)
    //var Box = null

    //useEffect(() => {
    //    var Box = new DiceBox("#dice-box", {
    //        assetPath: "/public/assets/dice-box/",
    //        theme: "default",
    //        offscreen: true,
    //        scale: 6
    //    });
    //}, [])

    //useEffect(() => {


    //    Box.init().then(async (world) => {
    //        // console.log("Box is ready");

    //        const Controls = new BoxControls({
    //            themes: ["default", "rust", "diceOfRolling", "gemstone"],
    //            themeColor: world.config.themeColor,
    //            onUpdate: (updates) => {
    //                Box.updateConfig(updates);
    //            }
    //        });
    //        Controls.themeSelect.setValue(world.config.theme);

    //        Box.onThemeConfigLoaded = (themeData) => {
    //            if (themeData.themeColor) {
    //                Controls.themeColorPicker.setValue(themeData.themeColor);
    //            }
    //        };

    //        // create display overlay
    //        const Display = new DisplayResults("#dice-box");

    //        // // create Roller Input
    //        const Roller = new AdvancedRoller({
    //            target: "#dice-box",
    //            onSubmit: (notation) => Box.roll(notation),
    //            onClear: () => {
    //                Box.clear();
    //                Display.clear();
    //            },
    //            onReroll: (rolls) => {
    //                // loop through parsed roll notations and send them to the Box
    //                rolls.forEach((roll) => Box.add(roll, roll.groupId));
    //            },
    //            onResults: (results) => {
    //                console.log(results);
    //                Display.showResults(results);
    //            }
    //        });

    //        // pass dice rolls to Advanced Roller to handle
    //        Box.onRollComplete = (results) => {
    //            Roller.handleResults(results);
    //        };
    //        Box.roll(["4d20", "4d12", "4d10", "4d8", "4d6", "4d4"]);
    //    });
    //}, [])

    /**
     * Primary library for rendering traditional js classes reactively
     * https://mobx.js.org/README.html 
     * */

    //Set up resource stores 
    const resourceHandler = new ResourceHandler()
    const curCharacter = new Character({ name: "Billy Wigglestick" })
    const actionHandler = new ActionHandler({ "curResources": resourceHandler, "curCharacter": curCharacter })
    const shopHandler = new ShopHandler(resourceHandler, curCharacter)
   
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
            />
        }


        return view
    })

    useEffect(() => {
        shopHandler.setCurShop("htg")
    }, [])



    autorun(() => {
        log("Resource Handler: ", JSON.stringify(resourceHandler)) // Also reads the entire structure.
        //console.log("Resource Handler: ", JSON.stringify(resourceHandler)) // Also reads the entire structure.
        
    })


    //Game State data
    const [curLocation, setCurLocation] = useState("Village")
    //const [curShop, setCurShop] = useState(null)


    /**
     * Action Processing
     */
    
    /**
     * render
     * */
    return (
        <>
            <GameView
                resourceHandler={resourceHandler}
                actionHandler={actionHandler}
                curCharacter={curCharacter}
                shopHandler={shopHandler}
                curLocation={curLocation}
            />
            {/*<div ref={diceBoxRef} id="dice-box"></div>*/}
        </>
    )

}