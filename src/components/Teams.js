import { Collapse, Paper, Stack, Typography } from '@mui/material'
import React from 'react'
import PlayerCard from './PlayerCard'
import { TransitionGroup } from 'react-transition-group';


const Teams = ({ teams, players }) => {


    const team = teams.map(team => {
        const playersInTeam = players.filter(palyer => palyer.team === team.name)
        if (playersInTeam.length > 0) {
            return (
                <Paper
                    key={team.name}
                    elevation={3}
                    sx={{
                        width: '100%',
                        p: 2
                    }}
                >
                    <Stack
                        spacing={2}

                    >
                        <Typography
                            align="center"
                            variant='subtitle1'
                            sx={{
                                fontWeight: "bold",
                            }}
                        >
                            {team.name === 'unsorted' ? "Без команды" : team.name.toUpperCase()} ({team.total})
                        </Typography>

                        {playersInTeam.map(player => (
                            <PlayerCard key={player.id} user={player} />
                        ))}
                    </Stack>

                </Paper>
            )
        }
        return (
            null
        )
    })

    return (
        <TransitionGroup>
            <Collapse >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-evenly"
                    alignItems="flex-start"
                    spacing={2}
                >
                    {team}
                </Stack>
            </Collapse>
        </TransitionGroup>
    )

}

export default Teams