import { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite"
import { Stack, Button, Typography, Box, Divider, Paper, Tooltip, Badge, Avatar, Grid, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import './CSS/Sidebar.css';

export default function Sidebar({ children }) {

    return (
        <Stack direction="column" className="sidebar">
            {children.map((child, childIndex) => {
                return (
                    <Container key={childIndex}>
                        <Box className="sidebar container">
                            {child}
                        </Box>
                        { childIndex < children.length - 1 ? <Divider/> : null}
                    </Container>
                )
            })}
        </Stack>
    )

}