import { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite"
import { styled } from '@mui/material/styles';
import { Stack, Button, Typography, Box, Divider, Paper, Tooltip, Grid, Avatar, Badge, AvatarGroup } from '@mui/material';
import amythystXS from '../../Assets/amythystXS.png';
import spentAmythystXS from '../../Assets/spentAmythystXS.png';
import { log } from '../Debugger';
import { ATTRIBUTES } from '../../Enums';
import * as DICEHELPERS from '../../Helpers/DiceHelpers';
import { autorun } from "mobx"
import * as SETTINGS from '../../GameSettings';

const Actions = observer(({ resourceHandler, actionHandler, attemptAction, curCharacter, isActionDisabled }) => {
    const [localActionHandler, setLocalActionHandler] = useState(actionHandler)

    const [highlightedAttribute, setHighlightedAttribute] = useState(null) //TODO: move to actions view
    const [highlightedAction, setHighlightedAction] = useState(null)
    const [rollProbabilities, setRollProbabilities] = useState([])

    useEffect(() => {
        autorun(() => {
            calculateActionProbabilities(actionHandler.actions)
        })
    }, [])

    function calculateActionProbabilities(actions) {
        log("Calculating Probs")
        log("Actions length: ", actions.length)
        let probabilities = []
        if (actions && actions.length > 0) {
            actions.forEach(action => probabilities.push(getProbabilties(action.statReq)))
            // foreach(let a
            log("All Probabilties: ", probabilities)
            setRollProbabilities(probabilities)
        }
    }

    function getProbabilties(stats) {
        log("Stats for probabilties")
        let dice = DICEHELPERS.getDiceArray()
        let modifiers = { total: 0 }
        let highest = curCharacter.getHighestMod(stats)
        modifiers[highest.attr] = highest.mod
        modifiers.total += highest.mod
        return DICEHELPERS.calculateRollProbabilities(dice, modifiers)
    }

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        justifyContent: 'space-between',
        flexDirection: 'column',
        display: 'flex',
        textAlign: 'center',
        height: "100%",
        backgroundColor: 'bisque',
        // color: theme.palette.text.secondary,
    }))

    function DisplayActionProgress({ progress }) {
        //log("Getting progress")
        //log("Progress: ", progress)
        const progressDisplay = []
        for (let gemIndex = 0; gemIndex < progress.total; gemIndex++) {
            //log("Loop: ", gemIndex)
            if (gemIndex < progress.completed) {
                //log("Adding completed gem")
                progressDisplay.push(<Avatar key={gemIndex} src={amythystXS} sx={{ maxWidth: 20, maxHeight: 25 }} />)
            }
            if (gemIndex >= progress.completed) {
                //log("Adding incompleted gem")
                progressDisplay.push(<Avatar key={gemIndex} src={spentAmythystXS} sx={{ maxWidth: 20, maxHeight: 25 }} />)
            }
        }
        //log("total: ", progressDisplay.length)
        return progressDisplay
    }

    function displayRewards(action) {
        let rewards = []
        for (const [reward, value] of action.rewards.entries())
            return (<></>)
    }

    function handleMouseEnterActionButton(e, stats) {
        let highest = curCharacter.getHighestMod(stats)
        setHighlightedAttribute(highest.attr)
    }

    function handleMouseLeaveActionButton(e) {
        // setRollProbabilities(null)
        setHighlightedAttribute(null)
    }

    function handleMouseEnterActionCard(e, actionCode) {
        // log(`highlighting Action: ${actionCode}`)
        e.preventDefault()
        setHighlightedAction(actionCode)
    }

    function handleMouseLeaveActionCard(e) {
        e.preventDefault()
        setHighlightedAction(null)
    }

    function handleMouseEnterAttr(e, stat) {
        e.preventDefault()
        setHighlightedAttribute(stat)
    }

    function handleMouseLeaveAttr(e) {
        e.preventDefault()
        setHighlightedAttribute(null)
    }

    function colorStatModifer(stat) {
        let avatarColor = 'red'
        let mod = curCharacter.getAttrModifier(stat)
        if (mod === 0)
            avatarColor = 'orange'
        if (mod > 0)
            avatarColor = 'yellow'
        if (mod >= 2)
            avatarColor = 'greenyellow'
        if (mod >= 3)
            avatarColor = 'green'
        return avatarColor
    }

    function colorAttr(stat, actionCode) {
        let color = 'default'
        if (stat === highlightedAttribute && actionCode === highlightedAction)
            color = 'skyblue'
        return color
    }

    function setAttrOpacity(stat, actionCode) {
        let opacity = '100%'
        if (
            actionCode === highlightedAction //we're on the right card
            && stat != highlightedAttribute  //we're not the currently highlighted attribute
            && highlightedAttribute != null) //There IS a currently highlighted attribute
            opacity = '25%'
        return opacity
    }

    return (
        <Box sx={{
            p: 1,
            backgroundColor: 'orange',
            borderRadius: "10px"
        }}>
            <Typography>
                Actions
            </Typography>
            <Box sx={{
                p: 1,
                flexGrow: 1,
                height: "auto",
                width: 'auto',
                maxHeight: "40vh",
                overflow: 'scroll'
            }}>
                <Divider sx={{ mb: 1 }} />
                <Grid
                    container
                    spacing={2}>
                    {/* {availbleActions.map((action, actionIndex) => { */}
                    {actionHandler.actions.map((action, actionIndex) => {
                        return (
                            <Grid item xs={4} key={actionIndex}>
                                <Item
                                    onMouseEnter={(e) => handleMouseEnterActionCard(e, action.actionCode)}
                                    onMouseLeave={(e) => handleMouseLeaveActionCard(e)}
                                >
                                    <Typography variant="body1">
                                        {action.name}
                                    </Typography>
                                    <Divider />
                                    <Stack direction="row" sx={{ justifyContent: 'center' }}>
                                        <DisplayActionProgress progress={action.clock.progress} />

                                    </Stack>
                                    <Divider />
                                    <Stack>
                                        {
                                            Object.entries(action.rewards).map(([resource, value]) => {
                                                return (
                                                    <Typography variant="subtitle2" key={resource}>
                                                        {resource}.......... {value}
                                                    </Typography>
                                                )
                                            })
                                        }

                                    </Stack>
                                    <Tooltip
                                        placement='right-end'
                                        sx={{ borderRadius: '5px' }}
                                        title={
                                            <>
                                                <Typography color="inherit">{action.description}</Typography>
                                                <Divider />
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        border: '1px solid black',
                                                        borderRadius: '5px',
                                                        p: 2
                                                    }}>
                                                    {rollProbabilities && rollProbabilities[actionIndex] ?
                                                        (Object.entries(rollProbabilities[actionIndex]).map(([outcome, probability]) => {
                                                            return (
                                                                <Stack key={outcome} sx={{ m: 'auto', mr: 1, ml: 1 }}>
                                                                    <Typography>
                                                                        {outcome.toUpperCase()}
                                                                    </Typography>
                                                                    <Divider />
                                                                    <Typography>
                                                                        {probability}%
                                                                    </Typography>
                                                                </Stack>
                                                            )
                                                        })
                                                        ) : null}
                                                </Box>
                                                <Box sx={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                                    <Typography color="inherit" sx={{ fontWeight: 600 }}>
                                                        
                                                        {`${SETTINGS.NUM_STARTING_DICE}d${SETTINGS.STARTING_DICE_SIZE} ${curCharacter.getAttrModifier(highlightedAttribute) >= 0 ? '+ '+ curCharacter.getAttrModifier(highlightedAttribute) : '- ' + curCharacter.getAttrModifier(highlightedAttribute)* -1} `}
                                                    </Typography>
                                                    <Typography color="inherit" sx={{ fontWeight: 600 }}>
                                                        {`+${highlightedAttribute}`}
                                                    </Typography>
                                                </Box>
                                            </>
                                        }>
                                        {/* <span style={{backgroundColor:'purple', width:'auto'}}> */}
                                        <Button
                                            onMouseEnter={(e) => handleMouseEnterActionButton(e, action.statReq)}
                                            onMouseLeave={(e) => handleMouseLeaveActionButton(e)}
                                            disabled={isActionDisabled(action)}
                                            variant="outlined"
                                            onClick={() => { attemptAction(action) }}
                                            sx={{ mr: '25%', ml: '25%' }}
                                        >
                                            Attempt
                                        </Button>
                                        {/* </span> */}
                                    </Tooltip>
                                    <Box
                                        sx={{
                                            // backgroundColor:"red",
                                            mt: "2px",
                                            width: '100%',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            display: 'flex',
                                            flexDirection: 'row'
                                        }}>
                                        <AvatarGroup spacing='small'>
                                            {action.statReq.map((stat, index) => {
                                                return (
                                                    <Badge
                                                        overlap="circular"
                                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                        badgeContent={
                                                            <Avatar
                                                                sx={{
                                                                    backgroundColor: colorStatModifer(stat),
                                                                    width: 10,
                                                                    height: 10,
                                                                    fontSize: '10px'
                                                                }}>
                                                                {curCharacter.getAttrModifier(stat)}
                                                            </Avatar>
                                                        }>
                                                        <Tooltip
                                                            disableInteractive
                                                            placement="top-end"
                                                            title={Object.keys(ATTRIBUTES).find(key => ATTRIBUTES[key] === stat)}
                                                        //     title={
                                                        //     <Typography color="inherit">
                                                        //         {/* {Object.keys(ATTRIBUTES).find(key => ATTRIBUTES[key] === stat)} */}
                                                        //         Test
                                                        //     </Typography>
                                                        // }
                                                        >
                                                            <Avatar
                                                                onMouseEnter={(e) => handleMouseEnterAttr(e, stat)}
                                                                onMouseLeave={(e) => handleMouseLeaveAttr(e)}
                                                                sx={{
                                                                    backgroundColor: colorAttr(stat, action.actionCode),
                                                                    opacity: setAttrOpacity(stat, action.actionCode)
                                                                }}>
                                                                {stat[0]}
                                                            </Avatar>
                                                        </Tooltip>
                                                    </Badge>
                                                )
                                            })}
                                        </AvatarGroup>
                                        <Avatar>
                                            {action.tier}
                                        </Avatar>
                                    </Box>
                                </Item>
                            </Grid>
                        )
                    })}

                </Grid >
            </Box>
        </Box >
    )
})

export default Actions