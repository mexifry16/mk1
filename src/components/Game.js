import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Stack, Button, Typography, Box, Divider, Paper } from '@mui/material';
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
            <Stack direction="column" sx={{ height: '100%', width: '25%', backgroundColor: 'lightgray', flexDirection: 'column' }}>
                <Stack sx={{ m: 5, backgroundColor: 'lightgray' }}>
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
            <Stack direction="row" sx={{ height: '100%', width: '100%', backgroundColor: 'orange' }}>

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
            <Stack sx={{ height: '100%', width: '100%', backgroundColor: '', border: 'solid', borderColor: 'black' }} >
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
        <Stack direction="row" sx={{ m: 'auto', height: '80vh', width: '100%', backgroundColor: 'gray', display: 'flex', alignContent: 'start' }}>
            <ResourcesTab />
            <Stack direction="column" sx={{ height: '100%', width: '100%', backgroundColor: 'gray', justifyContent: 'space-between' }}>
                <Stack sx={{ width: '95%', height: '100%', ml: 'auto', mr: 'auto', mt: 5 }} >
                    <Typography variant="h5">
                        {curCharacter.name}
                    </Typography>
                    <MainDisplay />
                </Stack>
                <Paper square={false} elevation={24} sx={{ maxHeight: 300, minHeight: 100, overflow: 'auto', width: '95%', ml: 'auto', mr: 'auto', mt: 5 }}>
                    <DisplayLog />
                </Paper>
            </Stack>
        </Stack>
    )

}
