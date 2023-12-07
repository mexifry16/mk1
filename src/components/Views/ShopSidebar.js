import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { Stack, Button, Typography, Box, Divider, Paper, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Items } from '../../Data/Items';
import { log } from '../Debugger';

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

const codes = ["axe", "wlt", "cnp"]

export default function ShopSidebar({ curCharacter, shopHandler, curLocation, resourceHandler, actionHandler }) {
    //const [itemCodes, setItemCodes] = useState([])
    //var itemCodes = []
    let curShop = shopHandler.curShop

    //useEffect(() => {
    //    if (curShop != undefined) {
    //        let newItemCodes = Array.from(curShop.inventory.keys())
    //        log("Incoming inventory: ", newItemCodes)
    //        setItemCodes(newItemCodes)
    //        //curShop.inventory
    //        //Object.keys(curShop.inventory).forEach(function (key, index) {
    //        //    newItems.push(key)
    //        //})
    //        //itemCodes = newItems
    //    }
    //}, [shopHandler.curShop.inventory])


    useEffect(() => {
        if (curShop != undefined) {
            log("Inventory: ", Array.from(curShop.inventory.keys()))
            log("quantities: ", Array.from(curShop.inventory.values()))
        }
    }, [])


    return (
        <Box sx={{ flexGrow: 1 }}>
            {curShop === undefined ? (
                <>
                    No Shop Selected
                </>
            ) : (
                <>
                    <Typography>
                        {curShop.name}
                    </Typography>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {Array.from(curShop.inventory.keys()).map((code) => {
                            //log("Mapping item: ", code)
                            //log("All items: ", Array.from(curShop.inventory.entries()))
                            return (
                                <Grid item xs={2} sm={4} md={4} key={code}>
                                    <Button onClick={() => {
                                        log("purchase clicked")
                                        shopHandler.makePurchase(code, 1)
                                    }}>
                                            <Item>
                                                {Items[code].name}
                                                <Divider />
                                                {curShop.inventory.get(code)}
                                            </Item>
                                    </Button>
                                </Grid>
                            )
                        })}
                    </Grid>
                </>
            )}

        </Box>
    )
}