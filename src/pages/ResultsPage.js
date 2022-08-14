import { Button, Stack, Typography } from '@mui/material'
import Spiner from 'components/spiner/Spiner'
import { useLastGame } from 'firebase1'
import { ResultTable } from 'components/ResultTable'
import { GameResult } from 'components/GameResult'
import LastGameDayChange from 'components/LastGameDayChange'
import { orange } from '@mui/material/colors'
import { Link as RouterLink, } from 'react-router-dom'
import useUserFromStore from 'hooks/useUserFromStore'

function ResultsPage() {
    const { isAdmin } = useUserFromStore()
    const [result, loading] = useLastGame()

    if (loading) {
        return (
            <Spiner />
        )
    }
    console.log('render result');

    return (
        <>

            <Typography sx={{ fontSize: 22 }} color="text.secondary" gutterBottom>Последний игровой день: {result?.name}</Typography>

            <Stack
                spacing={2}
            >
                {Object.keys(result.teams).length > 2 && <ResultTable result={result} />}
                <GameResult result={result} scoreRender={true} />
                <LastGameDayChange />
            </Stack>
        </>
    )
}

export default ResultsPage