import { useFetchData } from "firebase1"
import { Link as RouterLink, } from 'react-router-dom'
import Spiner from "components/spiner/Spiner";
import { Box, Button, Stack, Typography } from "@mui/material";
import useUserFromStore from "hooks/useUserFromStore";
import { orange } from "@mui/material/colors";
import Countdown from "components/Countdown";
import Teams from "components/Teams";
import GameSchedule from "components/GameSchedule";
import SubscribeButtons from "components/SubscribeButtons";



const TeamsPage = () => {
    const [players, loadingPlayers] = useFetchData('games/players/children')
    const [teams, loadingTeams] = useFetchData('games/teams/children')
    const [games] = useFetchData('games/gameDays/children')
    const { isAuth, isAdmin } = useUserFromStore()

    if (loadingPlayers || loadingTeams) {
        return (
            <Spiner />
        )
    }

    return (
        <>
            <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
            >
                <Countdown games={games} />
                <Box>
                    {players && <SubscribeButtons players={players} />}
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
                </Box>
            </Stack>
            {players?.length ? <Teams teams={teams} players={players} /> : <Typography align="center" variant="h5" mt={15}>Увы, пока что никто не записался.</Typography>}
            {teams && !!players?.length && <GameSchedule teams={teams} />}
            {isAuth &&
                <Stack
                    justifyContent="center"
                    sx={{
                        width: '100%',
                        p: 2
                    }}
                    direction={'row'}
                >

                </Stack>
            }
        </>
    )
}

export default TeamsPage