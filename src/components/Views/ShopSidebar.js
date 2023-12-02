import { useEffect, useState } from 'react';
import { Grid} from '@mui/material';
import { Stack, Button, Typography, Box, Divider, Paper, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


const inventory = {
    axe: {
        "id": 0,
        "name": "Axe",
        "description": "Belonged to your father",
        "tier": 1,
        "tags": ["chopsWood", "weapon", "dualWield", "slashing", "close"],
        "location": ["vil"]
    },
    wlt: {
        "id": 1,
        "name": "Wallet",
        "description": "brown leather",
        "tier": 1,
        "tags": ["goldStoreSmall"]
    },
    cnp: {
        "id": 2,
        "name": "Coin Purse",
        "description": "holds a fair amount of coins",
        "tier": 1,
        "tags": ["goldStoreMed"],
        "location": ["vil"]
    }
}

export default function ShopSidebar({ shop, location }) {
    

    return (
        <Stack>
            <Grid>
                {Object.keys(inventory).forEach((item) => {
                    <Grid>
                        <Item>{ item.name }</Item>
                    </Grid>
                })}
            </Grid>
        </Stack>
        )
}