import { Button, Stack, Typography } from '@mui/material'
import { addTeam } from '../firebase1';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextField } from 'formik-mui';
import { blueGrey } from '@mui/material/colors';


function AddTeamName() {

    const resetErrors = setErrors => {
        setTimeout(() => setErrors({}), 3000)
    }

    return (
        <Formik
            initialValues={{
                name: ''
            }}
            validationSchema={Yup.object({
                name: Yup.string()
                    .required('Название нам точно нужно')
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                addTeam(values)
                setSubmitting(false)
                resetForm()
            }}
        >
            {({ submitForm, isSubmitting, setErrors, errors, touched }) => (
                <Form>
                    <Typography
                        variant='h6'
                        align='center'
                        color={blueGrey.A400}
                    >
                        Добавить новую команду
                    </Typography>
                    <Field
                        component={TextField}
                        name='name'
                        label="Придумай название команды"
                        size='small'
                        margin='dense'
                        fullWidth
                    />
                    {errors.name && touched.name && resetErrors(setErrors)}
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
            )
            }

        </Formik >
    )
}

export default AddTeamName