import { Typography } from '@mui/material'
import { useHttp } from 'hooks/http.hook'
import { useEffect, useState } from 'react'

const Countdown = ({ games }) => {
    const [time, setTime] = useState('')

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

    return (
        <Typography
            align="center"
            variant="h4"
        >
            До игры {time}
        </Typography>
    )
}

export default Countdown