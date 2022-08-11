import { AvatarGroup, Box, Card, CardContent, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tooltip, Typography } from '@mui/material'
import Spiner from 'components/spiner/Spiner'
import { lastGame } from 'firebase1'
import { useEffect, useState } from 'react'
import { PlayerAvatar } from 'components/PlayerAvatar'
import Grid2 from '@mui/material/Unstable_Grid2';
import { green, red } from '@mui/material/colors'
import { visuallyHidden } from '@mui/utils';


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Команды',
    },
    {
        id: 'scored',
        numeric: true,
        disablePadding: false,
        label: 'Забито',
    },
    {
        id: 'conceded',
        numeric: true,
        disablePadding: false,
        label: 'Пропущено',
    },
    {
        id: 'difference',
        numeric: true,
        disablePadding: false,
        label: 'Разница',
    },
    {
        id: 'points',
        numeric: true,
        disablePadding: false,
        label: 'Очков',
    },
];


function ResultsPage() {
    const [result, setResult] = useState()
    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('points');

    useEffect(() => {
        async function fetchData() {
            const game = await lastGame()
            setResult(game)
            setLoading(false)
        }
        fetchData()
    }, [])

    const tableRender = () => {

        const handleRequestSort = (event, property) => {
            const isAsc = orderBy === property && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(property);
        };

        const createSortHandler = (property) => (event) => {
            handleRequestSort(event, property);
        };

        if (result) {
            const teams = Object.values(result?.teams)

            return (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {headCells.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.numeric ? 'center' : 'left'}
                                        padding={headCell.disablePadding ? 'none' : 'normal'}
                                        sortDirection={orderBy === headCell.id ? order : false}
                                    >
                                        {headCell.numeric ?
                                            <TableSortLabel
                                                active={orderBy === headCell.id}
                                                direction={orderBy === headCell.id ? order : 'asc'}
                                                onClick={createSortHandler(headCell.id)}
                                            >
                                                {headCell.label}
                                                {orderBy === headCell.id ? (
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                ) : null}
                                            </TableSortLabel>
                                            :
                                            headCell.label
                                        }
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teams.slice().sort(getComparator(order, orderBy))
                                .map((team) => (
                                    <TableRow
                                        key={team.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {team.name}
                                        </TableCell>
                                        <TableCell align="center">{team.scored}</TableCell>
                                        <TableCell align="center">{team.conceded}</TableCell>
                                        <TableCell align="center">{team.scored - team.conceded}</TableCell>
                                        <TableCell align="center">{team.points}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        }
    }

    const teamRender = (teamName, winner) => {
        const players = result.players

        return (
            <Card
                elevation={3}
                sx={{
                    width: '100%',
                    height: 'auto',
                    p: 2,
                    backgroundColor: winner ? green[300] : red[200]
                }}
            >
                <Stack
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                >
                    <Typography
                        align="center"
                        variant='subtitle1'
                        sx={{
                            fontWeight: "bold",
                        }}
                    >
                        {teamName.toUpperCase()}
                    </Typography>
                    <AvatarGroup
                        max={7}
                        spacing='small'
                    >
                        {Object.values(players).map((player, i) => (
                            player.team === teamName
                            &&
                            <Tooltip key={i} title={player.name}>
                                <IconButton sx={{ p: 0 }}>
                                    <PlayerAvatar user={player} />
                                </IconButton>
                            </Tooltip>
                        ))}
                    </AvatarGroup>
                </Stack>


            </Card>
        )
    }

    function renderGameResult() {
        if (result) {
            const results = result.results

            return (
                <Grid2 container spacing={2}>

                    {
                        results.map((result, i) => {
                            const teams = Object.keys(result)

                            return (
                                <Grid2 key={i} xs={12} md={6}>
                                    <Card >
                                        <CardContent>
                                            <Typography sx={{ fontSize: 22 }} color="text.secondary" gutterBottom>Игра {++i}</Typography>

                                            <Stack
                                                direction={{ md: 'row', xs: 'column' }}
                                                spacing={2}
                                                alignItems='center'
                                            >
                                                {teamRender(teams[0], result[teams[0]] > result[teams[1]])}
                                                <Typography variant='h3'>{result[teams[0]]}:{result[teams[1]]}</Typography>
                                                {teamRender(teams[1], result[teams[1]] > result[teams[0]])}
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            )
                        })
                    }
                </Grid2>
            )
        }
    }

    const gameResult = renderGameResult()
    const table = tableRender()

    return (
        <>
            {loading && <Spiner />}
            <Typography sx={{ fontSize: 22 }} color="text.secondary" gutterBottom>Последний игровой день: {result?.name}</Typography>
            <Stack
                spacing={2}
            >
                {table}
                {gameResult}
            </Stack>
        </>
    )
}

export default ResultsPage