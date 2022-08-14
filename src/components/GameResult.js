import { AvatarGroup, Card, CardContent, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { green, red } from '@mui/material/colors'
import { Field, Form, Formik } from 'formik'
import { PlayerAvatar } from './PlayerAvatar'
import * as Yup from 'yup'
import { TextField } from 'formik-mui'
import { updateResults } from 'firebase1'
import useUserFromStore from 'hooks/useUserFromStore'




export const GameResult = ({ result, scoreRender }) => {
    const { isAdmin } = useUserFromStore()

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
                    {players
                        &&
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
                    }
                </Stack>
            </Card>
        )
    }


    if (!result.results) {
        return (
            <Typography>Никто еще не заполнил результаты</Typography>
        )
    }

    return (
        <Stack
            direction='row'
            spacing={3}
            justifyContent='center'
            mt={2}
        >
            {Object.values(result.results).map((lap, idx) => {
                const keys = Object.keys(lap)

                let elem = {}
                if (keys.length > 2) {
                    elem = { ...lap }
                } else {
                    elem = { 0: lap }
                }

                return (
                    <Stack
                        key={idx}
                        spacing={2}
                        alignItems='center'
                    >
                        {keys.length > 2 && <Typography variant='h5'>Круг {++idx}</Typography>}
                        {Object.values(elem).map((game, i) => {
                            const teams = Object.keys(game)

                            const initialValues = {
                                ...game,
                                lap: idx,
                                num: +keys[i] || 1000
                            }

                            const validationSchema = Yup.object({
                                [teams[0]]: Yup.number()
                                    .min(0, 'Не может быть меньше 0'),
                                [teams[1]]: Yup.number()
                                    .min(0, 'Не может быть меньше 0'),
                                lap: Yup.number(),
                                num: Yup.number()
                            })


                            function handleSubmit(values, { setSubmitting }) {
                                updateResults(values)
                                setSubmitting(false)
                            }


                            return (
                                <Card key={i}>
                                    <CardContent>
                                        {lap.length && <Typography sx={{ fontSize: 22 }} color="text.secondary" gutterBottom>Игра {++i}</Typography>}
                                        <Stack
                                            direction={{ md: 'row', xs: 'column' }}
                                            spacing={2}
                                            alignItems='center'
                                        >
                                            {teamRender(teams[0], game[teams[0]] === game[teams[1]] || game[teams[0]] > game[teams[1]])}

                                            {isAdmin ?
                                                scoreRender && <Formik
                                                    initialValues={initialValues}
                                                    validationSchema={validationSchema}
                                                    onSubmit={handleSubmit}
                                                >
                                                    {({ submitForm }) => (
                                                        <Form
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <Field
                                                                component={TextField}
                                                                fullWidth
                                                                size='small'
                                                                margin='dense'
                                                                type="number"
                                                                variant="standard"
                                                                name={teams[0]}
                                                                onBlur={submitForm}
                                                            />
                                                            <Typography variant='h3'>:</Typography>
                                                            <Field
                                                                component={TextField}
                                                                fullWidth
                                                                size='small'
                                                                margin='dense'
                                                                type="number"
                                                                variant="standard"
                                                                onBlur={submitForm}
                                                                name={teams[1]}
                                                            />
                                                        </Form>

                                                    )}
                                                </Formik>
                                                :
                                                scoreRender && <Typography variant='h3'>{game[teams[0]]}:{game[teams[1]]}</Typography>
                                            }

                                            {teamRender(teams[1], game[teams[0]] === game[teams[1]] || game[teams[1]] > game[teams[0]])}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </Stack>
                )
            }
            )}
        </Stack>
    )

}


