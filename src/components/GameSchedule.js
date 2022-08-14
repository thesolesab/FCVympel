import { useHttp } from 'hooks/http.hook'
import React from 'react'
import { GameResult } from './GameResult'

const GameSchedule = ({ teams }) => {

    const { gameSchedule } = useHttp()

    const [game] = gameSchedule(teams)

    console.log(game);
    const prevGame = {
        ...game
    }

    console.log(prevGame);


    return (
        <>
            <GameResult result={game} scoreRender={false} />
        </>
    )
}


export default GameSchedule