import { Routes, Route, Outlet, Link } from "react-router-dom";
import { Stack, Button, Typography, Box, Divider } from '@mui/material';
import About from './components/About';
import Game from './components/Game';
import Dashboard from './components/Dashboard'
import logo from './logo.svg';
import './App.css';


export default function App() {
    return (
        <div>

            {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="about" element={<About />} />
                    <Route path="experiments" element={<Game />} />
                    <Route path="dashboard" element={<Dashboard />} />

                    {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
                    <Route path="*" element={<NoMatch />} />
                </Route>
            </Routes>
        </div>
    );
}

function Layout() {
    return (
        <Stack direction="column">
            {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}

            {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
            <Stack>
                <Typography variant="h1">
                    Hello World
                </Typography>
            </Stack>
            <Divider/>
            <Outlet />
            <Divider />
           
            <Stack direction="row" sx={{ width: '25%', m: 'auto', display: 'flex', justifyContent: 'space-evenly'}}>
                    <Link to="/">Home</Link>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/experiments">Experiments</Link>
                    <Link to="/about">About</Link>
                    <Link to="/nothing-here">Nothing Here</Link>
            </Stack>
        </Stack>
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