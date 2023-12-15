import { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite"
import { autorun, trace, getDependencyTree, getDebugName, getObserverTree, spy } from "mobx"
import { Stack, Button, Typography } from '@mui/material';
import Character from './Models/Character';
import ActionHandler from './Models/ActionHandler';
import ResourceHandler from './Models/ResourceHandler';
import ShopHandler from './Models/ShopHandler';
import MainScreen from './MainScreen';
import { Debugger, log, LOGGING_ENABLED, DEBUGGING_ENABLED } from './Debugger'

export default function Game() {
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
        <GameView
            resourceHandler={resourceHandler}
            actionHandler={actionHandler}
            curCharacter={curCharacter}
            shopHandler={shopHandler}
            curLocation={curLocation}
        />
    )

}