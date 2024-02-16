import { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite"
import { runInAction } from "mobx"
import { styled } from '@mui/material/styles';
import { Stack, Button, Typography, Box, Divider, Paper, Tooltip, Grid, Avatar, Badge, AvatarGroup } from '@mui/material';
import Split from '@uiw/react-split'
import SplitPane, { Pane } from 'split-pane-react';
import MenuIcon from '@mui/icons-material/Menu';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import Sidebar from './UI/Sidebar';
import SidebarSplitterPanel from './UI/SidebarSplitterPanel';
import { Scale } from '@mui/icons-material';
import ShopSidebar from './Views/ShopSidebar';
import { ResourceDisplay } from './Views/ResourceDisplay';
import { CharacterInventory } from './Views/CharacterInventory';
import Actions from './Views/ActionTable';
import ruby from '../Assets/ruby.png';
import spentRuby from '../Assets/spentRuby.png';
import amythystXS from '../Assets/amythystXS.png';
import spentAmythystXS from '../Assets/spentAmythystXS.png';
import { log } from './Debugger';
import { ATTRIBUTES } from '../Enums';
import * as DICEHELPERS from '../Helpers/DiceHelpers';
import { autorun } from "mobx"




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
                maxHeight: "15vh",
                minHeight: "10vh",
                overflow: "auto"
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
                    <Stack direction="column" sx={{ height: "100%" }}>
                        <Box sx={{ m: "3px", p: "3px" }}>
                            <CharacterDetails actionHandler={actionHandler} curCharacter={curCharacter} />
                        </Box>
                        <Stack direction="row" sx={{ m: 1 }}>
                            <Box
                                sx={{
                                    height: "100%",
                                    border: "2px solid black",
                                    backgroundColor: "pink",
                                    borderRadius: "10px",
                                    p: 2, mr: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-evenly"
                                }}>
                                <Button variant="contained">
                                    Actions
                                </Button>
                                <Button variant="contained">
                                    Shops
                                </Button>
                                <Button variant="contained">
                                    Dungeons
                                </Button>
                            </Box>
                            <Box sx={{
                                border: "2px solid black",
                                borderRadius: "10px",
                                justifyContent: "space-evenly"
                            }}>
                                <Actions
                                    resourceHandler={resourceHandler}
                                    actionHandler={actionHandler}
                                    attemptAction={attemptAction}
                                    isActionDisabled={isActionDisabled}
                                    curCharacter={curCharacter}
                                />
                            </Box>
                        </Stack>

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