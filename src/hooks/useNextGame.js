import { useSelector } from "react-redux"
import { selectNextGame } from "store/slices/gameSlice"



function useNextGame() {
    const prevGame = useSelector(selectNextGame)
    const nextGame = { ...prevGame[0] }

    return nextGame
}

export default useNextGame