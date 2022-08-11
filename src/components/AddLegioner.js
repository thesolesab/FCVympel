import { Button, Snackbar, Stack, Typography } from '@mui/material'
import { setPlayer } from 'firebase1'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import { forwardRef, useState } from 'react'
import * as Yup from 'yup';
import MuiAlert from '@mui/material/Alert';
import { v4 as uuidv4 } from 'uuid';
import { blueGrey } from '@mui/material/colors'

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function AddLegioner() {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false);
    }

    const resetErrors = setErrors => {
        setTimeout(() => setErrors({}), 3000);
    }

    return (
        <>
            <Formik
                initialValues={{
                    name: ''
                }}
                validationSchema={Yup.object({
                    name: Yup.string()
                        .required('Без имени никак(')
                        .nullable()
                })}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    values.id = uuidv4()
                    values.legioner = true
                    handleClick()
                    await setPlayer(values)
                    setSubmitting(false)
                    resetForm()
                }}
            >
                {({ submitForm, isSubmitting, touched, errors, setErrors }) => (
                    <Form>
                        <Typography
                            variant='h6'
                            align='center'
                            color={blueGrey.A400}
                        >
                            Добавить легионера
                        </Typography>
                        <Field
                            component={TextField}
                            fullWidth
                            margin='dense'
                            size="small"
                            label='Придумай имя'
                            name='name'
                        />
                        {touched.name && errors.name && resetErrors(setErrors)}

                        <Stack
                            direction='row'
                            justifyContent="flex-end"

                        >
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
                    </Form>
                )}
            </Formik >
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Легионер успешно добавлен!
                </Alert>
            </Snackbar>
        </>
    )
}

export default AddLegioner