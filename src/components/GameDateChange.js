import { Form, Formik } from 'formik'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import * as Yup from 'yup'
import { Button, Stack, TextField, Typography } from '@mui/material';
import { blueGrey, green } from '@mui/material/colors';
import ruLocale from 'date-fns/locale/ru';
import { setGameDay } from 'firebase1';
import useNextGame from 'hooks/useNextGame';
import { useState } from 'react';

function GameDateChange() {
    const nextGame = useNextGame()
    const [message, setMessage] = useState(false)

    let initialDate = new Date()

    if (nextGame.date) {
        initialDate = new Date(nextGame.date * 1000)
    }

    const successMessage = () => {
        setMessage(true)
        setTimeout(() => {
            setMessage(false)
        }, 3000)
    }

    return (
        <Formik
            initialValues={{
                date: initialDate
            }}
            validationSchema={Yup.object({
                date: Yup.date()
                    .required('Обязательно')
                    .nullable()
            })}
            onSubmit={async (values, { setSubmitting }) => {
                values.name = 'NextGame'
                values.id = 'nextGame'
                await setGameDay(values, true);
                setSubmitting(false)
                successMessage()
            }}
        >
            {({ values, isSubmitting, submitForm, setFieldValue }) => (
                <Form>
                    <Typography
                        variant='h6'
                        align='center'
                        color={blueGrey.A400}
                    >
                        Изменить дату и время игр
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
                        <DateTimePicker
                            label="Дата и время следующей игры"
                            value={values.date}
                            onChange={(value) => setFieldValue("date", value, true)}
                            renderInput={(params) => <TextField {...params} size='small' margin='dense' />}
                        />
                        <Stack
                            direction='row'
                            justifyContent="flex-end"
                            alignItems="center"

                        >
                            <Typography
                                color={green[500]}
                                mr={1}
                                display={message ? 'block' : 'none'}
                            >
                                Успешно добавленно
                            </Typography>
                            <Button
                                disabled={isSubmitting}
                                onClick={submitForm}
                                sx={{
                                    color: blueGrey.A400
                                }}
                            >
                                Добавить
                            </Button>
                        </Stack>
                    </LocalizationProvider>
                </Form>
            )}
        </Formik>
    )
}

export default GameDateChange