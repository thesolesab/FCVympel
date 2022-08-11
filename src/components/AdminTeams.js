import { Divider, Stack } from '@mui/material'
import AddTeamName from './AddTeamName';
import AddLegioner from './AddLegioner';
import GameDateChange from './GameDateChange';
import ChangeTeams from './ChangeTeams';


const AdminTeams = () => {
    return (
        <>
            <ChangeTeams />
            <Divider
                sx={{
                    m: 2
                }}
            />
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent='space-evenly'
                spacing={1}
            >
                <AddTeamName />
                <Divider orientation="vertical" variant="middle" flexItem />
                <AddLegioner />
                <Divider orientation="vertical" variant="middle" flexItem />
                <GameDateChange />
            </Stack>
            <Divider
                sx={{
                    m: 2
                }}
            />
        </>
    )
}

export default AdminTeams

