import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { Box } from '@mui/system';
import { visuallyHidden } from '@mui/utils';
import { headCells } from 'constants';
import { useState } from 'react';

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

export const ResultTable = ({ result }) => {

    function calcResults() {
        const teams = Object.values(result?.teams)
        const res = teams.map(team => {
            const name = team.name

            team = {
                ...team,
                scored: 0,
                conceded: 0,
                difference: 0,
                points: 0,
            }

            Object.values(result.results).forEach(lap => {
                Object.values(lap).forEach(game => {
                    if (Object.keys(game).includes(name)) {
                        const notName = Object.keys(game).filter(el => el !== name)
                        team.scored = team.scored + game[name]
                        team.conceded = team.conceded + game[notName]

                        if (game[name] > game[notName]) {
                            team.points = team.points + 3
                        } else if (game[name] === game[notName]) {
                            team.points = team.points + 1
                        }

                        team.difference = team.scored - team.conceded
                    }
                })
            })
            return team
        })

        return res
    }

    const teams = calcResults()

    console.log(teams);

    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('points');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
    };


    if (result) {
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
                                    <TableCell align="center">{team.scored || 0}</TableCell>
                                    <TableCell align="center">{team.conceded || 0}</TableCell>
                                    <TableCell align="center">{team.difference || 0}</TableCell>
                                    <TableCell align="center">{team.points || 0}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}
