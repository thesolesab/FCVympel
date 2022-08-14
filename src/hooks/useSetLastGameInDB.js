import { v4 as uuidv4 } from 'uuid';
import { deletePlayer, setGameDay, setLastGame, updateUser, useFetchData } from "firebase1"
import { useEffect } from "react"
import { useHttp } from "./http.hook"
import useNextGame from "./useNextGame"

function useSetLastGameInDB() {
    const [players] = useFetchData('games/players/children')
    const [teams] = useFetchData('games/teams/children')

    const nextGame = useNextGame()

    const { gameSchedule } = useHttp()

    useEffect(() => {
        const today = new Date()
        const condidate = new Date(nextGame?.date * 1000)

        if (today > condidate) {

            const newDate = +condidate + 7 * 24 * 60 * 60 * 1000
            const prevGame = JSON.parse(JSON.stringify(nextGame))
            nextGame.date = new Date(newDate)
            setGameDay(nextGame, true)

            // Создаем архивную запись

            prevGame.id = uuidv4()
            prevGame.name = new Intl.DateTimeFormat('ru-Ru', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }).format(new Date(prevGame.date * 1000))
            prevGame.players = { ...players.filter(player => +player.createdAt.seconds * 1000 < +prevGame.date * 1000) }
            prevGame.teams = { ...teams.filter(team => team.name !== 'unsorted').filter(team => team.total > 0) }
            const [schedule] = gameSchedule(teams)
            console.log(schedule);
            prevGame.results = { ...schedule.results }

            console.log(prevGame);

            if (Object.keys(prevGame.players).length > 0 && Object.keys(prevGame.teams).length > 0) {
                setLastGame(prevGame)
                setGameDay(prevGame, false)
            }

            // if (!!players?.find(player => player?.id === currentUser?.id)) {
            //     setDialogOpen(true)
            // }

            //Удаляем игроков

            players.filter(player => +player.createdAt.seconds * 1000 < +prevGame.date * 1000).forEach(player => {
                // updateUser(player, true, false)
                // deletePlayer(player.name)
            })
        }

    }, [gameSchedule, nextGame, players, teams])

}

export default useSetLastGameInDB