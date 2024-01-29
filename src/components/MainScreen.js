import { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite"
import { runInAction } from "mobx"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Stack, Button, IconButton, Typography, Box, Divider, Paper, Tooltip, Badge, Avatar, Drawer, AppBar, Toolbar, Container } from '@mui/material';
import Split from '@uiw/react-split'
import SplitPane, { Pane } from 'split-pane-react';
import MenuIcon from '@mui/icons-material/Menu';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import Sidebar from './UI/Sidebar';
import SidebarSplitterPanel from './UI/SidebarSplitterPanel';
import ShopSidebar from './views/ShopSidebar';
import { ResourceDisplay } from './views/ResourceDisplay';
import { CharacterInventory } from './views/CharacterInventory';
import ruby from '../Assets/ruby.png';
import spentRuby from '../Assets/spentRuby.png';
import amythystXS from '../Assets/amythystXS.png';
import spentAmythystXS from '../Assets/spentAmythystXS.png';
import { log } from './Debugger';




export default function MainScreen({
    resourceHandler,
    actionHandler,
    curCharacter,
    shopHandler,
    curLocation,
    playerLog,
    attemptAction,
    isActionDisabled,
    rest }) {
    const [menuBarOpen, setMenuBarOpen] = useState(false)
    const [currentView, setCurrentView] = useState(0)

    const rollDice = (e) => {
        e.preventDefault();
    };

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
        let actionPointGems = []
        for (let i = 0; i < curCharacter.AP; i++) {
            if (i < curCharacter.curAP)
                actionPointGems.push(<Avatar key={i} src={ruby} />)
            if (i >= curCharacter.curAP)
                actionPointGems.push(<Avatar key={i} src={spentRuby} />)
        }

        return (
            <Stack direction="row" backgroundColor="blue" sx={{ justifyContent: 'space-between' }}>
                <Stack direction="column">
                    <Typography variant="h5">
                        {curCharacter.name}
                    </Typography>
                    <Stack direction="row">
                        <Typography variant="h6">
                            Action Points:
                        </Typography>
                        {actionPointGems}
                    </Stack>

                </Stack>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => { rest() }}
                    sx={{ minWidth: 100 }}>
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

        // const checkAvailability = (action) => {
        //     return isActionDisabled(action)
        // }

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
            <Stack direction="row" sx={{ backgroundColor: 'orange', height:"100%" }}>
                <Stack direction="column">
                    <Typography>
                        Actions
                    </Typography>
                    <Divider />
                    {/* {availbleActions.map((action, actionIndex) => { */}
                    {actionHandler.actions.map((action, actionIndex) => {
                        return (
                            <Stack direction="row" key={actionIndex} >
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
                                        <Button
                                            disabled={isActionDisabled(action)}
                                            variant="outlined"
                                            onClick={() => { attemptAction(action) }}>
                                            <Stack direction="column">
                                                <Typography variant="h6">
                                                    {action.name}
                                                </Typography>
                                                <Divider />
                                                <Stack direction="row">
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
            <Stack sx={{
                width: "100%", height: "auto",
                backgroundColor: "yellowgreen",
                maxHeight:"15vh",
                overflow:"auto"
            }}>
                <Typography variant="h6">
                    Action Log!
                </Typography>
                {playerLog.length > 0 ? (
                    <>
                        {playerLog.map((logItem, logIndex) => {
                            return (
                                <div key={logIndex} style={{ height: 'auto', width: '100%', backgroundColor: 'lightgray' }} >
                                    <Typography>
                                        {logItem}
                                    </Typography>
                                    <Divider />
                                </div>
                            )
                        })}
                    </>
                ) : (null)}

            </Stack>
        )
    })

    /**
     * RENDER
     * */
    return (
        <div style={{
            position: "relative",
            top: 0, right: 0, bottom: 0, left: 0,
            border: "1px solid black",
            display: "block",
            // padding: 5,
            backgroundColor: "purple",
            height: "100%"
            // top: 0,
            // bottom: 0,
            // margin: 0,
            // minHeight: "100%"
        }}>
            <Splitter style={{ height: '100%', width: "100%" }} layout="horizontal">
                {/*<Split style={{ height: "80vh", border: '1px solid #d5d5d5', borderRadius: 3 }}>*/}
                <SidebarSplitterPanel size={10}>
                    <Sidebar children={
                        [
                            <ResourceDisplay key={0} resourceHandler={resourceHandler} actionHandler={actionHandler} />,
                            <CharacterInventory key={1} curCharacter={curCharacter} />

                        ]
                    }>
                    </Sidebar>
                </SidebarSplitterPanel>
                <SidebarSplitterPanel size={80}>
                    <Stack direction="column" sx={{height:"100%"}}>
                        <Box sx={{ m: "3px", p: "3px" }}>
                            <CharacterDetails actionHandler={actionHandler} curCharacter={curCharacter} />
                        </Box>
                        <Actions
                            resourceHandler={resourceHandler}
                            actionHandler={actionHandler}
                            attemptAction={attemptAction}
                            isActionDisabled={isActionDisabled}
                        />
                        <DisplayLog resourceHandler={resourceHandler} actionHandler={actionHandler} />
                    </Stack>
                </SidebarSplitterPanel>
                <SidebarSplitterPanel size={10}>
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
                </SidebarSplitterPanel>

            </Splitter>
        </div >
    )

}