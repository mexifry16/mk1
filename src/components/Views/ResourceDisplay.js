import { observer } from "mobx-react-lite"
import { Stack, Typography, Divider } from '@mui/material';


export const ResourceDisplay = observer(({ resourceHandler }) => {
    return (
        <Stack direction="column" sx={{ flexDirection: 'column', textAlign: "center" }}>
            <Typography variant="h5">
                Resources
            </Typography>
            <Divider />
            <Stack sx={{ m: 5, textAlign: "start" }}>
                <Typography>
                    Coins: {resourceHandler.coins}/{resourceHandler.maxCoins}
                </Typography>
                <>
                    <Divider />
                    <Typography>
                        Wood: {resourceHandler.wood}/{resourceHandler.maxWood}
                    </Typography>
                </>
            </Stack>
        </Stack>
    )
})
