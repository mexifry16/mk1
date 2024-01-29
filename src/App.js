import { Routes, Route, Outlet, Link } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { Stack, Button, Typography, Box, Divider, Container } from '@mui/material';
import { observer } from "mobx-react-lite"
import About from './SiteComponents/About';
import Game from './components/Game';
import Dashboard from './SiteComponents/Dashboard';
import logo from './logo.svg';
import './App.css';
import DisplayResults from "@3d-dice/dice-ui/src/displayResults";
import { purple } from "@mui/material/colors";

export default function App() {


    return (
        <>
            <div style={{
                backgroundColor: "black",
                width: "99%",
                height: "95vh",
                padding: 5,
                margin: 5,
                display: "flex",
                flexDirection: "column"
            }}>
                < Box sx={{
                    display:"flex",
                    p:"5px",
                    m:"5px",
                    height: "10%",
                    backgroundColor: "white",
                    
                }}>
                    <Typography variant="h4" sx={{mt:"auto", mb:"auto", backgroundColor:"pink"}}>
                        WIP
                    </Typography>
                </Box >
                <div style={{
                    // width: "100%",
                    // heignt: "100%",
                    height: "80%",
                    left: 0,
                    right: 0,
                    backgroundColor: 'orangered',
                    padding: 5,
                    margin: 5
                }}>
                    {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
                    {/* <Route path="/" element={<Layout />}> */}
                    <Routes>
                        <Route path="/about" element={<About />} />
                        <Route path="/experiments" element={<Game />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="*" element={<NoMatch />} />
                        {/* Using path="*"" means "match anything", so this route
                    acts like a catch-all for URLs that we don't have explicit
                    routes for. */}
                    </Routes>
                </div >
                <Stack direction={"row"} sx={{
                    width: '75%',
                    height: "5%",
                    mr: 'auto', ml: 'auto',
                    justifyContent: 'space-evenly',
                    backgroundColor: "white",
                    alignItems:"center"
                }}>
                    <Link to="/">Home</Link>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/experiments">Experiments</Link>
                    <Link to="/about">About</Link>
                    <Link to="/nothing-here">Nothing Here</Link>
                </Stack>
            </div >
        </>
    );
}

function Layout() {
    return (

        <>

            {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
            < Box sx={{ backgroundColor: "white" }
            }>
                <Typography variant="h2">
                    Hello World
                </Typography>
            </Box >
            <Box sx={{
                width: "100%",
                heignt: "100%",
                backgroundColor: 'orangered'
            }}>
                <Outlet />
            </Box >
            <Stack direction="row" sx={{
                width: '75%',
                mt: '5', mr: 'auto', ml: 'auto',
                justifyContent: 'space-evenly',
                backgroundColor: "white"
            }}>
                <Link to="/">Home</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/experiments">Experiments</Link>
                <Link to="/about">About</Link>
                <Link to="/nothing-here">Nothing Here</Link>
            </Stack>
        </>
    );
}


function NoMatch() {
    return (
        <div>
            <h2>Nothing to see here!</h2>
            <p>
                <Link to="/">Go to the home page</Link>
            </p>
        </div>
    );
}