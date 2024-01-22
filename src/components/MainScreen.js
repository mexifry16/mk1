import { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite"
import { runInAction } from "mobx"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Stack, Button, IconButton, Typography, Box, Divider, Paper, Tooltip, Badge, Avatar, Drawer, AppBar, Toolbar } from '@mui/material';
import Split from '@uiw/react-split'
import SplitPane, { Pane } from 'split-pane-react';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './UI/Sidebar';
import ShopSidebar from './views/ShopSidebar';
import { ResourceDisplay } from './views/ResourceDisplay';
import { CharacterInventory } from './views/CharacterInventory';
import ruby from '../Assets/ruby.png';
import spentRuby from '../Assets/spentRuby.png';
import amythystXS from '../Assets/amythystXS.png';
import spentAmythystXS from '../Assets/spentAmythystXS.png';
import { log } from './Debugger';




export default function MainScreen({ resourceHandler, actionHandler, curCharacter, shopHandler, curLocation, test, attemptAction }) {

    //useEffect(() => {
    //    let diceBox = document.getElementById("dice-box")
    //    if (diceBox != null) {
    //        log("Dicebox element found, initiating")
    //        //Dice.init().then(() => {
    //        //    // clear dice on click anywhere on the screen
    //        //    document.addEventListener("mousedown", () => {
    //        //        const diceBoxCanvas = document.getElementById("dice-canvas");
    //        //        if (window.getComputedStyle(diceBoxCanvas).display !== "none") {
    //        //            Dice.hide().clear();
    //        //        }
    //        //    });
    //        //});
    //    }
    //},[])

    const rollDice = (e) => {
        e.preventDefault();
        //const attr = e.currentTarget.id.replace("roll-", "");
        //if (attr === "all") {
        //    return onRoll(["3d6", "3d6", "3d6", "3d6", "3d6", "3d6"]);
        //}
        //onRoll("3d6");
    };
   

    const [menuBarOpen, setMenuBarOpen] = useState(false)

    const toggleDrawer = (open) => (event) => {
        log("test")
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            log("Event was tab or shift. Aborting")
            return;
        }
        log("Opening menu bar")
        setMenuBarOpen(open);
    }

    const ShopSidebarView = observer(({ curCharacter, shopHandler, curLocation, resourceHandler, actionHandler }) =>
        <ShopSidebar
            location={curLocation}
            shopHandler={shopHandler}
            resourceHandler={resourceHandler}
            actionHandler={actionHandler}
            curCharacter={curCharacter}
        />)

    //UX State data
    const [currentView, setCurrentView] = useState(0)
    //const [actionLog, setActionLog] = useState([])

    //function addActionLog(message) {
    //    let newLog = [...actionLog]
    //    newLog.unshift(message)
    //    setActionLog(newLog)
    //}

    /**
     * View Processing
     */
    function setView(newView) {
        setCurrentView(newView)
    }

    function MainDisplay() {
        let display = <></>
        switch (currentView) {
            case 0:
                display = (<Actions />)
            default:
                log("how did you get here?")
        }

        return display
    }


    const CharacterDetails = observer(({ actionHandler }) => {
        let gems = []
        for (let i = 0; i < actionHandler.curCharacter.AP; i++) {
            if (i < actionHandler.curCharacter.curAP)
                gems.push(<Avatar key={i} src={ruby} />)
            if (i >= actionHandler.curCharacter.curAP)
                gems.push(<Avatar key={i} src={spentRuby} />)
        }

        return (
            <Stack direction="row">
                <Stack direction="column">
                    <Typography variant="h4">
                        {actionHandler.curCharacter.name}
                    </Typography>
                    <Stack direction="row">
                        <Typography variant="h5">
                            Action Points:
                        </Typography>
                        {gems}

                    </Stack>

                </Stack>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => { actionHandler.rest() }}
                    sx={{ position: "absolute", top: "20%", bottom: "20%", right: "2%", minWidth: 100 }}>
                    REST
                </Button>
            </Stack>
        )
    })

    /**
     * Display Components
     * */

    const Actions = observer(({ resourceHandler, actionHandler, attemptAction }) => {



        //function doAction(actionIndex) {
        //    //log("Doing action (Action Display)")
        //    let outcome = actionHandler.attemptAction(actionIndex)
        //    log("++++++++++++++++++++++++++++++++++++++++++")
        //    log("Results: ", outcome)
        //    //addActionLog(result)

        //}

        function DisplayActionProgress({ progress }) {
            //log("Getting progress")
            //log("Progress: ", progress)
            const progressDisplay = []
            for (let gemIndex = 0; gemIndex < progress.total; gemIndex++) {
                //log("Loop: ", gemIndex)
                if (gemIndex < progress.completed) {
                    //log("Adding completed gem")
                    progressDisplay.push(<Avatar key={gemIndex} src={amythystXS} sx={{ maxWidth: 20, maxHeight: 25 }} />)
                }
                if (gemIndex >= progress.completed) {
                    //log("Adding incompleted gem")
                    progressDisplay.push(<Avatar key={gemIndex} src={spentAmythystXS} sx={{ maxWidth: 20, maxHeight: 25 }} />)
                }
            }
            //log("total: ", progressDisplay.length)
            return progressDisplay
        }

        return (
            <Stack direction="row" sx={{ backgroundColor: 'orange' }}>
                <Stack direction="column">
                    <Typography>
                        Actions
                    </Typography>
                    <Divider />
                    {/* {availbleActions.map((action, actionIndex) => { */}
                    {actionHandler.actions.map((action, actionIndex) => {
                        return (
                            <Stack direction="row" key={action.name} >
                                <Tooltip
                                    title={
                                        <>
                                            <Typography color="inherit">{action.name}</Typography>
                                            <Divider />
                                            <Typography color="inherit">{action.description}</Typography>
                                        </>
                                    }
                                    placement="right-end">
                                    <span>
                                        <Button disabled={action.disabled} variant="outlined" onClick={() => { attemptAction(action) }}>
                                            <Stack direction="column">
                                                <Typography variant="h6">
                                                    {action.name}
                                                </Typography>
                                                <Divider />
                                                <Stack direction="row">
                                                    test
                                                    <DisplayActionProgress progress={action.clock.progress} />

                                                </Stack>
                                                <Typography variant="subtitle">
                                                    {action.description}
                                                </Typography>
                                            </Stack>
                                        </Button>
                                    </span>
                                </Tooltip>
                            </Stack>
                        )
                    })}

                </Stack>

            </Stack>
        )
    })

    const EventDisplay = observer(({ resourceHandler, actionHandler }) => {
        //TODO: something that can display a column of events the player can trigger
        return (
            <>
                Hello World
            </>

        )
    })

    const DisplayLog = observer(({ resourceHandler, actionHandler }) => {
        //log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        //log(actionLog)
        return (

            <Stack >
                <Typography >
                    Action Log
                </Typography>
                {actionHandler.actionLog.length > 0 ? (
                    <>
                        {actionHandler.actionLog.map((logItem, logIndex) => {
                            return (
                                <Stack key={logIndex} sx={{ height: 'auto', width: '100%', backgroundColor: 'lightgray' }} >
                                    <Typography>
                                        {logItem}
                                    </Typography>
                                    <Divider />
                                </Stack>
                            )
                        })}
                  </>
                ): (null) }
                
            </Stack>
        )
    })

    /**
     * render
     * */
    return (
        <Split style={{ height: "80vh", border: '1px solid #d5d5d5', borderRadius: 3 }}>

            <div style={{ flex: 1 }}>
                <Sidebar children={
                    [
                        
                        <Button
                            variant="contained"
                            id="roll-all"
                            className="button"
                            aria-label="Roll Attributes Points"
                            onClick={rollDice}
                        >
                            Roll Dice
                        </Button>,
                        <ResourceDisplay key={0} resourceHandler={resourceHandler} actionHandler={actionHandler} />,
                        <CharacterInventory key={1} curCharacter={curCharacter} />

                    ]
                }>

                </Sidebar>
            </div>
            <Split mode="vertical" style={{ width: '70%' }}>
                <div style={{ height: '80%' }}>
                    <AppBar position="static" color="primary" enableColorOnDark>
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                                onClick={toggleDrawer(true)}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Box sx={{ m: 1, p: 1 }}>
                                <CharacterDetails actionHandler={actionHandler} curCharacter={curCharacter} />

                            </Box>
                            <Drawer
                                anchor="top"
                                open={menuBarOpen}
                                onClose={toggleDrawer(false)}
                            >
                                Hello World - test test test
                            </Drawer>
                        </Toolbar>
                    </AppBar>
                    <Actions resourceHandler={resourceHandler} actionHandler={actionHandler} attemptAction={attemptAction} />
                </div>
                <Split style={{ height: '20%' }}>
                    <div style={{ flex: 1, overflow: 'auto' }}>
                        <DisplayLog resourceHandler={resourceHandler} actionHandler={actionHandler} />
                    </div>
                </Split>
            </Split>
            <div style={{ flex: 1 }}>
                <Sidebar children={
                    [
                        <ShopSidebarView
                            key={0}
                            location={curLocation}
                            shopHandler={shopHandler}
                            resourceHandler={resourceHandler}
                            actionHandler={actionHandler}
                            curCharacter={curCharacter}
                        />

                    ]
                }>

                </Sidebar>

            </div>


        </Split>
    )

}