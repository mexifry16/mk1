import { useState, useEffect } from 'react';
import { Stack, Button, Typography, Box, Avatar, List, ListItem, ListItemText, ListItemAvatar, IconButton, Divider } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import TODO from './ToDo'

export default function Dashboard() {

    

    function GreetingMessage() {
        let greeting = "Hello there Jesse!"
        let variant = "h4"
        let hours = new Date().getHours()

        //if (hours < 4) {
        //    greeting = "GO TO BED"
        //    variant = "h1"
        //}
        //if (hours >= 4 && hours < 6) {
        //    greeting = "You're up early"
        //}
        switch (true) {
            case (hours < 4):
                greeting = "GO TO BED"
                variant = "h1"
                break
            case (hours >= 4 && hours < 6):
                greeting = "You're up early"
                break
            case (hours >= 6 && hours < 12):
                greeting = "Good morning Jesse"
                break
            case (hours >= 12 && hours < 13):
                greeting = "Good noon to you"
                break
            case (hours >= 13 && hours < 17):
                greeting = "Good afternoon Jesse"
                break
            case (hours >= 17):
                greeting = "Good evening Jesse"
                break
            default:
                greeting = "default"
        }
        return (
            <Typography variant={variant}>
                {greeting}
            </Typography>
            )

    }

    function DisplayTime() {
        const [today, setToday] = useState(new Date())

        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const month = ["Janurary", "February", "March", "April", "May", "June", "July", "August", "October", "November", "December"]

        useEffect(() => {
            const interval = setInterval(() => { setToday(new Date()) }, 500);
        }, [])
        let time = today.getHours() + ":" + String(today.getMinutes()).padStart(2, '0') + ":" + today.getSeconds();
        var date = `${weekday[today.getDay()]} the ${today.getDate()}${getDayPostfix()} of ${month[today.getMonth() - 1]} ${today.getFullYear()}`;

        function getDayPostfix() {
            let postFix = null
            let day = today.getDate()
            let ones = Math.floor(day % 10)
            switch (ones) {
                case 1: 
                    break;
                case 2: 
                    break;
                case 3: 
                    break;
                default:
                    postFix = "th"
            }
            return postFix
        }
        return (
            <Stack direction="row" >
                <Typography variant="h4" sx={{ m: "auto" }}>
                    it's
                </Typography>
                <Typography variant="h1" sx={{ m: "auto" }}>
                    {time}
                </Typography>
                <Typography variant="h2" sx={{ m: "auto" }}>
                    {date}
                </Typography>
            </Stack>
        )

    }
    

    return (
        <Stack direction="row" sx={{ height: '100%', width: '100%', backgroundColor: 'black' }} >
            <Stack sx={{ height: '50%', width: '50%', m: 'auto', backgroundColor: 'darkseagreen' }}>
                <GreetingMessage/>
                <DisplayTime />
                <Typography>
                    Here's what's on your plate today:
                </Typography>
                <Divider/>
                <Stack direction='row'>
                    <TODO />
                </Stack>
            </Stack>
        </Stack>
    )
} 