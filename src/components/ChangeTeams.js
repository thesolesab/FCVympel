import { Divider, IconButton, Paper, Stack, Typography } from '@mui/material'
import { deletePlayer, deleteTeam, useFetchData } from 'firebase1'
import ClearIcon from '@mui/icons-material/Clear';
import AddPlayerInTeam from './AddPlayerInTeam';
import { blueGrey } from '@mui/material/colors';
import { Fragment } from 'react';


function ChangeTeams() {
    const [teams, loadingTeams] = useFetchData('games/teams/children')
    const [players, loadingPlayers] = useFetchData('games/players/children')

    async function handleDeleteTeam(name) {
        await deleteTeam(name)
    }

    async function handleDeletePlayer(name) {
        await deletePlayer(name)
    }


    return (
        <Fragment>
            <Typography
                variant='h6'
                align='center'
                color={blueGrey.A400}
                mb={3}
            >
                Собираем составы
            </Typography>
            {players?.length === 0 ? 'Никого нет' : null}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="center"
                alignItems="flex-start"
                spacing={2}
            >
                {teams && teams.map(team => (
                    <Paper
                        key={team.name}
                        elevation={4}
                        sx={{
                            width: '100%',
                            p: 1
                        }}
                    >
                        <Stack
                            direction={'row'}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography
                                sx={{
                                    fontWeight: "bold",
                                }}
                            >
                                {team.name === 'unsorted' ? "Все записавшиеся" : team.name} ({team.total})
                            </Typography>
                            {team.name !== 'unsorted' &&
                                <IconButton color="error" onClick={() => handleDeleteTeam(team.name)}>
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            }
                        </Stack>
                        <Divider />
                        {players?.filter(el => el.team === team.name).map(player => (
                            <Fragment key={player.id}>
                                <Stack
                                    direction='row'
                                    justifyContent='space-between'
                                    alignItems='center'
                                >
                                    <Typography >{player.name} {player.legioner && '(легионер)'}</Typography>
                                    <IconButton color="error" onClick={() => handleDeletePlayer(player.name)}>
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                                <Divider />
                            </Fragment>
                        ))}
                        {team.name !== 'unsorted' &&
                            <>
                                {!loadingTeams && !loadingPlayers && <AddPlayerInTeam players={players} team={team.name} />}
                            </>
                        }
                    </Paper>
                ))}
            </Stack>
        </Fragment>
    )
}

export default ChangeTeams