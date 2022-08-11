import useNextGame from "hooks/useNextGame"
import { forwardRef, useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Stack } from '@mui/material';
import { deletePlayer, lastGame, questionedPlayer, setGameDay, setLastGame, updateUser, useAuth, useFetchData } from 'firebase1';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function DialogOnOpen() {
    const [pastGame, setPastGame] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [currentPlayer, setCurrentPlayer] = useState(null)

    const [players] = useFetchData('games/players/children')
    const [teams] = useFetchData('games/teams/children')

    const nextGame = useNextGame()
    const { currentUser } = useAuth()


    useEffect(() => {
        const unsub = async () => {
            const game = await lastGame()
            setPastGame(game)
            const players = Object.values(game.players)

            const currentPlayer = players.find(player => player.id === currentUser?.id)

            if (!!currentPlayer && !currentPlayer.questioned) {
                const idx = players.indexOf(currentPlayer)
                setCurrentPlayer(idx)
                setDialogOpen(true)
            }

        }
        unsub()
        return unsub
    }, [currentUser])

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

            if (Object.keys(prevGame.players).length > 0 && Object.keys(prevGame.teams).length > 0) {
                setGameDay(prevGame, false)
                setLastGame(prevGame)
            }

            if (!!players?.find(player => player?.id === currentUser?.id)) {
                setDialogOpen(true)
            }

            //Удаляем игроков

            players.filter(player => +player.createdAt.seconds * 1000 < +prevGame.date * 1000).forEach(player => {
                updateUser(player, true, false)
                deletePlayer(player.name)
            })
        }

    }, [currentUser?.id, nextGame, players, setDialogOpen, teams])

    function handleSubmit(values, { setSubmitting }) {
        // console.log(values)
        updateUser(currentUser, false, values)
        questionedPlayer(currentPlayer)
        setSubmitting(false)
        setDialogOpen(false)
    }

    function handleClose() {
        questionedPlayer(currentPlayer)
        setDialogOpen(false)
    }

    return (
        <Dialog
            open={dialogOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Как прошла игра, {currentUser?.name}?</DialogTitle>
            <DialogContent>

                <Formik
                    initialValues={{
                        goals: 0
                    }}
                    validationSchema={Yup.object({
                        goals: Yup.number()
                            .min(0, 'Не может быть меньше 0')
                    })}
                    onSubmit={handleSubmit}
                >
                    {({ submitForm }) => (
                        <Form>
                            <DialogContentText >
                                Сколько голов забил, {pastGame?.name}?
                            </DialogContentText>
                            <Field
                                component={TextField}
                                fullWidth
                                size='small'
                                margin='dense'
                                type="number"
                                name='goals'
                            />
                            <DialogActions component={Stack} direction='row' sx={{
                                justifyContent: "space-evenly"
                            }}>
                                <Button onClick={handleClose} color='error'>Неважно</Button>
                                <Button onClick={submitForm} color='success'>Готово</Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}

export default DialogOnOpen