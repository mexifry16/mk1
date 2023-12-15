import { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite"
import { Stack, Button, Typography, Box, Divider, Paper, Tooltip, Avatar, Grid, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import './CSS/CharacterInventory.css';
import blankItemSm from '../../Assets/blankItemMed.png';


export const CharacterInventory = observer(({ curCharacter }) => {

    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.body2,
        padding: theme.spacing(1),
        minHeight: 50,
        minWidth: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        justifyItems: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const inventory = Array.from(curCharacter.inventory, ([name, item]) => ([name, item]));

    //const [activeTab, setActiveTab] = useState(0)
    //const [selectedItem, setSelectedItem] = useState(0)
    //const [orderBy, setOrderBy] = useState("None")

    //let tile = <Paper> </Paper>
    //array = Array.from(map, ([name, value]) => ({ name, value }));
    //let it
    //let items = []
    //for (let i = 0; i < curCharacter.AP; i++) {
    //    if (i < curCharacter.curAP)
    //        gems.push(ActiveGem)
    //    if (i >= curCharacter.curAP)
    //        gems.push(inactiveGem)
    //}

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: -3,
            top: 40,
            border: `2px solid ${theme.palette.background.paper}`,
            padding: '0 4px',
        },
    }));

    return (
        <Stack direction="column" sx={{ flexDirection: 'column', textAlign: "center" }}>
            <Typography variant="h5">
                Inventory
            </Typography>
            <Divider />
            {
                inventory.length > 0 ? (

                    <Grid container columns={{ xs: 2, sm: 4, md: 12 }}>
                        {/*<Paper sx={{ borderRadius: 5, ml: "2%", mr: "2%", mt: "2%", mb: "2%", backgroundColor: "lightGray", border: "2px outset"}}>*/}
                        {inventory.map((item, itemIndex) => {
                            let curItem = item[1]
                            return (
                                <Grid item xs={2} sm={4} md={4} key={itemIndex}>
                                    <Tooltip
                                        title={
                                            <>
                                                <Typography color="inherit">{curItem.name}</Typography>
                                                <Divider />
                                                <Typography color="inherit">{curItem.description}</Typography>
                                            </>
                                        }
                                        placement="right-start">
                                            <Button>
                                                <Item>
                                                    {curItem.name}
                                                <StyledBadge badgeContent={curItem.quantity} color="primary">
                                                    <Avatar key={itemIndex} src={blankItemSm} />
                                                </StyledBadge>
                                                </Item>
                                            </Button>
                                    </Tooltip>
                                </Grid>
                            )
                        })}
                    </Grid>
                ) : (
                    <>
                        Inventory empty
                    </>
                )
            }
        </Stack>
    )


})
