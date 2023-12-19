import { useEffect, useState } from 'react';
import { autorun } from "mobx"
import { Grid } from '@mui/material';
import { Stack, Button, Typography, Box, Divider, Paper, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Items } from '../../Data/Items';
import { log } from '../Debugger';





export default function ShopSidebar({ curCharacter, shopHandler, curLocation, resourceHandler, actionHandler }) {
    //const [itemCodes, setItemCodes] = useState([])
    //var itemCodes = []
    let curShop = shopHandler.curShop
    const [disabledStock, setDisabledStock] = useState([])
    const [sortedInventory, setSortedInventory] = useState([])
    const [sortBy, setSortBy] = useState("name")

    useEffect(() => {
        //TODO: If filtering is applied to the inventory, it may become desynced from the disabled flags
        autorun(() => {
            //if (curShop) {
            if (curShop && curShop.inventory.size > 0) {
                //log("disabling stock")
                let inventory = Array.from(curShop.inventory.entries())
                let disabled = []
                //log("Stock changed: ", inventory)
                inventory.forEach((item, index) => {
                    disabled.push(shopHandler.isItemDisabled(item[0]))
                    //log("key: ", item)
                    //log("value: ", value)
                    //log("index: ", index)
                })
                setDisabledStock(disabled)
            }
            //}
        })
    }, [])
    


    useEffect(() => {
        if (curShop != undefined) {
            log("Shop Stock: ", Array.from(curShop.inventory.entries()))
            //log("quantities: ", Array.from(curShop.inventory.values()))
        }
    }, [])


    function makePurchase(itemCode, quantity) {
        let results = shopHandler.makePurchase(itemCode, quantity)
        log("Purchase results: ", results)
        let total = results.totalPurchased ?? 0
        if (total > 0) {
            curCharacter.addItem(itemCode, total)
            actionHandler.refreshActions()
        }
    }

    function test() {
        return true
    }

    return (
        <Box sx={{ flexGrow: 1, textAlign:"center", pr:5, pl:5}}>
            {curShop === undefined ? (
                <>
                    No Shop Selected
                </>
            ) : (
                <>
                    <Typography variant="h5">
                        {curShop.name}
                        </Typography>
                        <Divider/>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} >
                        {Array.from(curShop.inventory.keys()).map((code, itemIndex) => {
                            //log("Mapping item: ", code)
                            //log("All items: ", Array.from(curShop.inventory.entries()))
                            return (
                                <Grid item xs={2} sm={4} md={4} key={itemIndex}>
                                    <Tooltip>
                                        <Paper sx={{minHeight: 75, minWidth:75, maxHeight:150, maxWidth:75, m:"auto"}}>
                                            <Button
                                                disabled={disabledStock[itemIndex]}
                                                //foo() works, foo doesn't. foo() only runs once
                                                onClick={() => {
                                                    log("purchase clicked")
                                                    makePurchase(code, 1)
                                                }}>

                                                <Box>
                                                    {Items[code].name}
                                                    <Divider />
                                                    {curShop.inventory.get(code)}
                                                    <Divider />
                                                    Cost:{shopHandler.determinePrice(Items[code])}
                                                </Box>
                                            </Button>
                                        </Paper>
                                    </Tooltip>
                                </Grid>
                            )
                        })}
                    </Grid>
                </>
            )}

        </Box>
    )
}


//const Item = styled(Paper)(({ theme }) => ({

//    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//    ...theme.typography.body2,
//    padding: theme.spacing(1),
//    textAlign: 'center',
//    color: theme.palette.text.secondary,
//}));


//const inventory = {
//    axe: {
//        "id": 0,
//        "name": "Axe",
//        "description": "Belonged to your father",
//        "tier": 1,
//        "tags": ["chopsWood", "weapon", "dualWield", "slashing", "close"],
//        "location": ["vil"]
//    },
//    wlt: {
//        "id": 1,
//        "name": "Wallet",
//        "description": "brown leather",
//        "tier": 1,
//        "tags": ["goldStoreSmall"]
//    },
//    cnp: {
//        "id": 2,
//        "name": "Coin Purse",
//        "description": "holds a fair amount of coins",
//        "tier": 1,
//        "tags": ["goldStoreMed"],
//        "location": ["vil"]
//    }
//}

//const codes = ["axe", "wlt", "cnp"]

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
