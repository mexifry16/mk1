import { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Stack, Button, Typography, Box, Divider, Paper, Tooltip, Badge, Avatar } from '@mui/material';
import Split from '@uiw/react-split'
import SplitPane, { Pane } from 'split-pane-react';
import Sidebar from './UI/Sidebar';
import ShopSidebar from './Views/ShopSidebar';
import { ResourceDisplay } from './Views/ResourceDisplay';
import { CharacterInventory } from './Views/CharacterInventory';
import ruby from '../Assets/ruby.png';
import spentRuby from '../Assets/spentRuby.png';
import { log } from './Debugger';

export default function MainScreen({ resourceHandler, actionHandler, curCharacter, shopHandler, curLocation, test }) {

    const ShopSidebarView = observer(({ curCharacter, shopHandler, curLocation, resourceHandler, actionHandler }) =>
        <ShopSidebar
            location={curLocation}
            shopHandler={shopHandler}
            resourceHandler={resourceHandler}
            actionHandler={actionHandler}
            curCharacter={curCharacter}
        />)

    //Game State data
    //const [curLocation, setCurLocation] = useState("Village")
    //const [curShop, setCurShop] = useState(null)
    //const [actionLog, setActionLog] = useState([])

    //UX State data
    const [currentView, setCurrentView] = useState(0)
    const [curSidebarView, setCurSidebarView] = useState(0)
    //const [leftSidebar, setLeftSidebar] = useState(0)
    //const [rightSidebar, setRightSidebar] = useState(0)
    const [actionLog, setActionLog] = useState([])

    function addActionLog(message) {
        let newLog = [...actionLog]
        newLog.unshift(message)
        setActionLog(newLog)
    }

    //function doAction(actionIndex) {
    //    addActionLog(actionHandler.doAction(actionIndex))
    //    let newlog = [...actionlog]
    //    newlog.unshift(message)
    //    setActionList(newLog)
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


    const CharacterDetails = observer(({ curCharacter }) => {
        //let ActiveGem = <Avatar src={ruby} />
        //let inactiveGem = <Avatar src={spentRuby} />

        let gems = []
        for (let i = 0; i < curCharacter.AP; i++) {
            if (i < curCharacter.curAP)
                gems.push(<Avatar key={i} src={ruby} />)
            if (i >= curCharacter.curAP)
                gems.push(<Avatar key={i} src={spentRuby} />)
        }

        return (
            <Stack direction="column">
                <Typography variant="h4">
                    {curCharacter.name}
                </Typography>
                <Stack direction="row">
                    <Typography variant="h5">
                        Action Points:
                    </Typography>
                    {gems}

                </Stack>
            </Stack>
        )
    })


    //const ResourcesTab = observer(({ resourceHandler, actionHandler }) => {



    //})

    /**
     * Display Components
     * */
    const ResourcesTab = observer(({ resourceHandler, actionHandler }) => {
        return (
            <Stack direction="column" sx={{flexDirection: 'column' }}>
                <Stack sx={{ m: 5}}>
                    <Typography variant="h5">
                        Resources
                    </Typography>
                    <Divider />
                    {//resourceHandler.coins > 0 ? 
                    }
                    <Typography>
                        Coins: {resourceHandler.coins}/{resourceHandler.maxCoins}
                    </Typography>
                    {// }: null}
                    }
                    <Divider />
                    {resourceHandler.wood > 0 ?
                        <Typography>
                            Wood: {resourceHandler.wood}/{resourceHandler.maxWood}
                        </Typography>
                        : null}
                </Stack>
            </Stack>
        )
    })



    const Actions = observer(({ resourceHandler, actionHandler, test }) => {

        

        function doAction(actionIndex) {
            log("Doing action (Action Display)")
            let result = actionHandler.doAction(actionIndex)
            log("Results: ", result)
            addActionLog(result)
  
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
                                    <Button variant="outlined" onClick={() => { doAction(actionIndex)}}>
                                        <Stack direction="column">
                                            <Typography variant="h6">
                                                {action.name}
                                            </Typography>
                                            <Divider />
                                            <Typography variant="subtitle">
                                                {action.description}
                                            </Typography>
                                        </Stack>
                                    </Button>
                                </Tooltip>
                            </Stack>
                        )
                    })}

                </Stack>

            </Stack>
        )
    })

    const DisplayLog = observer(({ resourceHandler, actionHandler }) => {
        return (

            <Stack >
                <Typography >
                    Action Log
                </Typography>
                {actionLog.map((logItem, logIndex) => {
                    return (
                        <Stack key={logIndex} sx={{ height: 'auto', width: '100%', backgroundColor: 'lightgray' }} >
                            <Typography>
                                {logItem}
                            </Typography>
                            <Divider />
                        </Stack>
                    )
                })}
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
                        <ResourceDisplay key={0} resourceHandler={resourceHandler} actionHandler={actionHandler} />,
                        <CharacterInventory key={1} curCharacter={curCharacter} />
                        
                    ]
                }>
                    
                </Sidebar>
            </div>
            <Split mode="vertical" style={{ width: '70%' }}>
                <div style={{ height: '80%' }}>
                    <CharacterDetails curCharacter={curCharacter} />
                    <Actions resourceHandler={resourceHandler} actionHandler={actionHandler} test={test} />
                </div>
                <Split style={{ height: '20%' }}>
                    <div style={{ flex: 1, overflow: 'auto' }}>
                        <DisplayLog resourceHandler={resourceHandler} actionHandler={actionHandler} />
                    </div>
                </Split>
            </Split>
            <div style={{ flex: 1 }}>
                <ShopSidebarView
                    location={curLocation}
                    shopHandler={shopHandler}
                    resourceHandler={resourceHandler}
                    actionHandler={actionHandler}
                    curCharacter={curCharacter}
                />
            </div>


        </Split>
    )

}