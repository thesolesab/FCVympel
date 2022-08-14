import { logout } from "firebase1";
import { useDispatch } from "react-redux";
import { userLogout } from "store/slices/userSlice";
import { useNavigate } from "react-router-dom";

export const useHttp = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            await dispatch(userLogout())
            navigate('/')
        } catch (e) {
            console.log(e);
        }
    }

    function declensionNum(num, words) {
        return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]];
    }

    const timeToGame = (nextGameDate) => {

        const today = new Date()
        const delta = nextGameDate - today
        let text = 'null'

        if (Math.floor(delta / 1000 / 60 / 60 / 24) > 0) {
            const days = delta > 0 ? Math.floor(delta / 1000 / 60 / 60 / 24) : 0
            const hours = delta > 0 ? Math.floor(delta / 1000 / 60 / 60) % 24 : 0
            text = `${declensionNum(days, ['остался', 'осталось', 'осталось'])} ${days} ${declensionNum(days, ['день', 'дня', 'дней'])}, ${hours} ${declensionNum(hours, ['час', 'часа', 'часов'])}`
        } else if (Math.floor(delta / 1000 / 60 / 60) > 0) {
            const hours = delta > 0 ? Math.floor(delta / 1000 / 60 / 60) % 24 : 0;
            const minutes = delta > 0 ? Math.floor(delta / 1000 / 60) % 60 : 0;
            text = `${declensionNum(hours, ['остался', 'осталось', 'осталось'])} ${hours} ${declensionNum(hours, ['час', 'часа', 'часов'])}, ${minutes} ${declensionNum(minutes, ['минута', 'минуты', 'минут'])}`
        } else {
            const minutes = Math.floor(delta / 1000 / 60)
            text = `${minutes} ${declensionNum(minutes, ['минута', 'минуты', 'минут'])}`
        }

        return text
    }

    const gameSchedule = (teams) => {
        const teamsList = teams?.filter(team => team.name !== 'unsorted')

        const numOfTeams = Object.keys(teamsList).length
        const gameDayDuration = 90
        const numOfGamesInLap = (numOfTeams * (numOfTeams - 1) / 2)
        const numOfLaps = Math.round(gameDayDuration / (numOfGamesInLap * 10))
        const gameDuration = gameDayDuration / (numOfLaps * numOfGamesInLap)

        const result = {
            results: {}
        }

        function createGame(a, b) {
            const game = {
                [a.name]: 0,
                [b.name]: 0
            }
            return game
        }

        function createSchedule() {
            const lapNum = [
                [0, 1],
                [1, 2],
                [2, 3],
                [3, 0],
                [0, 2],
                [1, 3]
            ]

            const lap = {}
            for (let i = 0; i < lapNum.length; i++) {
                if (lapNum[i][0] < teamsList.length && lapNum[i][1] < teamsList.length) {
                    const a = createGame(teamsList[lapNum[i][0]], teamsList[lapNum[i][1]])
                    lap[i] = { ...a }
                }
            }

            for (let i = 0; i < numOfLaps; i++) {
                result.results[i] = lap
            }

            return result
        }


        if (Object.keys(teamsList).length > 2) {
            const schedule = createSchedule()

            return [schedule, gameDuration]
        } else {
            result.results = [createGame(teamsList[0], teamsList[1])]

            const schedule = result

            return [schedule, gameDuration]
        }
    }


    return { handleLogout, timeToGame, gameSchedule }
}

