import { deletePlayer, setPlayer, useFetchData } from "firebase1"
import { Link as RouterLink, } from 'react-router-dom'
import { Container } from "@mui/system"
import Spiner from "components/spiner/Spiner";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import PlayerCard from "components/PlayerCard";
import useUserFromStore from "hooks/useUserFromStore";
import VerifyEmail from "components/VerifyEmail";
import { orange } from "@mui/material/colors";
import { useHttp } from "hooks/http.hook";
import { useEffect, useState } from "react";


function TeamsPage() {

    const [players] = useFetchData('games/players/children')
    const [teams, loading] = useFetchData('games/teams/children')
    const [games] = useFetchData('games/gameDays/children')
    const [time, setTime] = useState('')

    const { id, isAuth, name, isAdmin, emailVerified } = useUserFromStore()

    const { timeToGame } = useHttp()

    useEffect(() => {
        const NextGameDate = new Date(games?.find(el => el.name === 'NextGame')?.date?.seconds * 1000)
        const c = timeToGame(NextGameDate)
        setTime(c)

        const interval = setInterval(() => {
            if (NextGameDate) {
                const c = timeToGame(NextGameDate)
                setTime(c)
            }
        }, 60000)
        return () => clearInterval(interval)
    }, [games, timeToGame])

    async function handleSubscribe() {
        await setPlayer({ id, name })
    }

    async function handleUnsubscribe() {
        await deletePlayer(name)
    }

    function renderTeams() {
        if (teams && players) {
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
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-evenly"
                    alignItems="flex-start"
                    spacing={2}
                >
                    {team}
                </Stack>
            )

        }
    }

    const teamInRender = renderTeams()

    function renderButton() {
        if (teams) {

            if (players.map(el => el.id).includes(id)) {
                return (
                    <Button
                        onClick={handleUnsubscribe}
                        color='error'
                    >
                        Выписаться
                    </Button>
                )
            } else {
                if (!emailVerified) {
                    return (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'baseline'
                            }}
                        >
                            <Typography>Для записи вам нужно</Typography>
                            <VerifyEmail color='warning' />
                        </Box >
                    )
                }
                return (
                    <Button
                        onClick={handleSubscribe}
                        color='success'
                    >
                        Записаться
                    </Button>
                )
            }
        }
    }

    const buttons = renderButton()

    return (
        <>
            {loading && <Spiner />}
            <Typography
                align="center"
                variant="h4"
            >
                До игры {time}
            </Typography>
            {players?.length ? teamInRender : <Typography align="center" variant="h5" mt={15}>Увы, пока что никто не записался.</Typography>}
            {isAuth &&
                <Stack
                    justifyContent="center"
                    sx={{
                        width: '100%',
                        p: 2
                    }}
                    direction={'row'}
                >
                    {buttons}
                    {isAdmin &&
                        <Button
                            sx={{
                                color: orange[500]
                            }}
                            component={RouterLink}
                            to='/admin#team'
                        >
                            Собрать составы
                        </Button>
                    }
                </Stack>
            }
        </>
    )


}
export default TeamsPage