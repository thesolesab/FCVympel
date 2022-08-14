import { forwardRef, useEffect, useState } from "react"
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Stack } from '@mui/material';
import { questionedPlayer, updateUser, useAuth, useLastGame } from 'firebase1';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function DialogOnOpen() {
    const [pastGame, setPastGame] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [currentPlayer, setCurrentPlayer] = useState(null)

    const { currentUser } = useAuth()

    const [game, loading] = useLastGame()


    useEffect(() => {
        if (!loading && game) {
            setPastGame(game)
            const players = Object.values(game.players)

            const currentPlayer = players.find(player => player.id === currentUser?.id)

            if (!!currentPlayer && !currentPlayer.questioned) {
                const idx = players.indexOf(currentPlayer)
                setCurrentPlayer(idx)
                setDialogOpen(true)
            }
        }


    }, [currentUser?.id, game, loading])

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