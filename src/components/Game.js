import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Stack, Button, Typography, Box, Divider, Paper } from '@mui/material';
//import Split from 'react-split'
import Split from '@uiw/react-split'
import SplitPane, { Pane } from 'split-pane-react';
import Character from './Character';

export default function Game() {

    const [curCharacter, setCurCharacter] = useState(new Character({ "name": "Billy Wigglestick" }))
    const [availbleActions, setAvailableActions] = useState([])
    const [coins, setCoins] = useState(0)
    const [wood, setWood] = useState(0)
    const [currentView, setCurrentView] = useState(0)
    const [actionLog, setActionLog] = useState(["test test test", "Hello world", "I've got a lovely bunch of coconuts"])

    //useEffect(() => {

    //}, [])

    function addActionLog(message) {
        let newLog = [...actionLog]
        newLog.unshift(message)
        setActionLog(newLog)
    }

    const AvailableActions = [

    ]

    function setView(newView) {
        setCurrentView(newView)
    }


    function incrementCoins() {
        let prevCoins = coins
        let newCoins = prevCoins + 1
        setCoins(newCoins)
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

    function ResourcesTab() {
        return (
            <Stack direction="column" sx={{ height: '100%', width: '100%', backgroundColor: 'azure', flexDirection: 'column' }}>
                <Stack sx={{ m: 5, backgroundColor: 'azure' }}>
                    <Typography>
                        Resources
                    </Typography>
                    <Divider />
                    <Typography>
                        Coins: {coins}
                    </Typography>
                    <Divider />
                    <Typography>
                        Wood: {wood}
                    </Typography>
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
                    <Stack direction="row">
                        <Typography>
                            Increase a thing
                        </Typography>
                        <Button variant="contained" onClick={incrementCoins}>
                            Click Me
                        </Button>
                    </Stack>
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
                        <Stack sx={{ height: 'auto', width: '100%', backgroundColor: 'lightgray' }} >
                            <Typography key={logIndex}>
                                {logItem}
                            </Typography>
                            <Divider />
                        </Stack>
                    )
                })}
            </Stack>
        )
    }

    return (
        <Split style={{ height: "80vh", border: '1px solid #d5d5d5', borderRadius: 3}}>

            <div style={{ flex: 1}}>
                <ResourcesTab />
            </div>
            <Split mode="vertical" style={{width:'70%'}}>
                <div style={{ height: '80%' }}>
                    <Actions />
                </div>
                <Split style={{ height: '20%'  }}>
                    <div style={{ flex: 1 }}>
                        <DisplayLog/>
                    </div>
                </Split>
            </Split>
            <div style={{ flex: 1 }}>Build Menu</div>


        </Split>
    );

}
