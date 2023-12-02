import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Stack, Button, Typography, Box, Divider, Paper, Tooltip } from '@mui/material';
import Split from '@uiw/react-split'
import SplitPane, { Pane } from 'split-pane-react';
import ShopSidebar from './Views/ShopSidebar'
import Character from './Models/Character';
import { getAreaActions } from '../Data/ActionList'

export default function Game() {

    //Character data
    const [curCharacter, setCurCharacter] = useState(new Character({ "name": "Billy Wigglestick" }))
    const [availbleActions, setAvailableActions] = useState([])

    //Player resources
    const [coins, setCoins] = useState(0)
    const [maxCoins, setMaxCoins] = useState(10)
    const [wood, setWood] = useState(0) 
    const [maxWood, setMaxWood] = useState(10)
    const [resources, setResource] = useState({})

    //Game State data
    const [curLocation, setCurLocation] = useState("Village")
    const [curShop, setCurShop] = useState(null)
    const [actionLog, setActionLog] = useState([])
    

    //UX State data
    const [currentView, setCurrentView] = useState(0)
    const [curSidebarView, setCurSidebarView] = useState(0) 

    useEffect(() => {
        setAvailableActions(getAreaActions(curLocation, curCharacter, {"coins":coins, "wood":wood}))
    }, [curCharacter])

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
                console.log("how did you get here?")
        }

        return display
    }

    /**
     * Action Processing
     */
    function addActionLog(message) {
        let newLog = [...actionLog]
        newLog.unshift(message)
        setActionLog(newLog)
    }

    function doAction(actionIndex) {
        console.log("Doing Action")
        let results = availbleActions[actionIndex]
        for (const [resource, value] of Object.entries(results.effect)) {
            switch (resource) {
                case "wood":
                    addWood(value)
                    break;
                case "coin":
                    addCoins(value)
                    break;
                default:
                    console.log("Resource Not Accounted For : ", resource)
            }
            addActionLog(results.message)
        }
    }

    /**
     * Setters
     * */
    
    function addCoins(val) {
        let prevCoins = coins
        let newCoins = prevCoins + val
        newCoins = newCoins > maxCoins ? maxCoins : newCoins
        setCoins(newCoins)
    }

    function addWood(val) {
        let prevWood = wood
        let newWood = prevWood + val
        newWood = newWood > maxWood ? maxWood : newWood
        setWood(newWood)
    }

    /**
     * Display Components
     * */
    function ResourcesTab() {
        return (
            <Stack direction="column" sx={{ height: '100%', width: '100%', backgroundColor: 'azure', flexDirection: 'column' }}>
                <Stack sx={{ m: 5, backgroundColor: 'azure' }}>
                    <Typography>
                        Resources
                    </Typography>
                    <Divider />
                    {coins > 0 ? 
                        <Typography>
                            Coins: {coins}/{maxCoins}
                        </Typography>
                        : null}
                    <Divider />
                    {wood > 0 ?
                        <Typography>
                            Wood: {wood}/{maxWood}
                        </Typography>
                        : null}
                </Stack>
            </Stack>
        )
    }

    function Actions() {
        return (
            <Stack direction="row" sx={{ backgroundColor: 'orange' }}>

                <Stack direction="column">
                    <Typography>
                        Actions
                    </Typography>
                    <Divider />
                    {availbleActions.map((action, actionIndex) => {
                        return (
                            <Stack direction="row" key={action.name} >
                                <Tooltip
                                    title={
                                        <>
                                            <Typography color="inherit">{action.name}</Typography>
                                            <Divider/>
                                            <Typography color="inherit">{action.description}</Typography>
                                        </>
                                    }
                                    placement="right-end">
                                    <Button variant="outlined" onClick={() => { doAction(actionIndex) }}>
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
    }


    function DisplayLog() {
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
    }

    /**
     * render
     * */
    return (
        <Split style={{ height: "80vh", border: '1px solid #d5d5d5', borderRadius: 3 }}>

            <div style={{ flex: 1 }}>
                <ResourcesTab />
            </div>
            <Split mode="vertical" style={{ width: '70%' }}>
                <div style={{ height: '80%' }}>
                    <Actions />
                </div>
                <Split style={{ height: '20%' }}>
                    <div style={{ flex: 1, overflow: 'auto' }}>
                        <DisplayLog />
                    </div>
                </Split>
            </Split>
            <div style={{ flex: 1 }}>
                <ShopSidebar
                    location={curLocation}
                    shop={curShop}
                />
            </div>


        </Split>
    );

}
