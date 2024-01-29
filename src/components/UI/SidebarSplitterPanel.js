import { useState } from 'react';
import { SplitterPanel } from 'primereact/splitter';
import { Stack, Box, Divider, Container, Drawer, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Outlet } from "react-router-dom";

export default function SidebarSplitterPanel({ size }) {
    // const MAX_SIZE = 50
    // const MIN_SIZE = 10
    // const COLLAPSED_SIZE = 0
    return (
        <SplitterPanel size={size}>
            <Outlet />
        </SplitterPanel>
    )
}