import {
    Alert,
    AlertTitle,
    Backdrop,
    Button,
    CircularProgress,
    Container,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import { defaultAvatar } from 'constants'
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextField as FormikTextField } from 'formik-mui';
import AvatarsList from 'components/AvatarsList';
import { red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { signup } from 'firebase1';
import { useState } from 'react';

const RegistrationPage = () => {
    const navigate = useNavigate()
    const [errorMsg, setErrorMsg] = useState('')

    return (
        <Container sx={{ pt: 5 }}>
            <Paper elevation={3} square sx={{ p: 5 }}>
                <Typography variant='h6'>  Регистрация</Typography>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                        name: '',
                        avatar: defaultAvatar,
                    }}
                    validationSchema={Yup.object({
                        email: Yup.string()
                            .email('Неверный email')
                            .required('Обязательное поле!'),
                        password: Yup.string()
                            .min(6, 'Слишком короткий пароль')
                            .max(20, 'Слишком длинное')
                            .required('Обязательное поле!'),
                        name: Yup.string()
                            .min(2, 'Слишком короткое')
                            .max(50, 'Слишком длинное')
                            .required('Обязательное поле!'),
                        avatar: Yup.string()
                            .required('Выберите аватар')
                            .nullable(),
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            await signup(values)
                            setSubmitting(false)
                            navigate('/')
                        } catch (error) {
                            setSubmitting(false)
                            if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
                                setErrorMsg('Такой пользователь уже существует')
                                setTimeout(() => {
                                    setErrorMsg('')
                                }, 10000)
                            } else {
                                alert(error.message)
                            }

                        }
                    }}
                >
                    {({ values, submitForm, resetForm, isSubmitting, touched, errors }) => (
                        <>
                            <Form>
                                <Field
                                    component={FormikTextField}
                                    fullWidth
                                    margin="dense"
                                    size="small"
                                    name="email"
                                    type="email"
                                    label="Email"
                                    helperText={errors.email && touched.email ? errors.email : null}
                                />
                                <Field
                                    component={FormikTextField}
                                    fullWidth
                                    margin="dense"
                                    size="small"
                                    name="password"
                                    type="password"
                                    label="Пароль"
                                    helperText={errors.password && touched.password ? errors.password : null}

                                />
                                <Field
                                    component={FormikTextField}
                                    fullWidth
                                    margin="dense"
                                    size="small"
                                    name="name"
                                    label="Имя"
                                    helperText={errors.name && touched.name ? errors.name : null}

                                />

                                <AvatarsList />
                                {errors.avatar && touched.avatar && <Typography align='center' color={red.A400}>{errors.avatar}</Typography>}
                                <Stack
                                    direction='row'
                                    justifyContent="flex-end"
                                    mt={5}
                                >
                                    <Button
                                        variant="outlined"
                                        disabled={isSubmitting}
                                        onClick={submitForm}
                                        color='success'

                                    >
                                        Регистрация
                                    </Button>
                                </Stack>
                            </Form>
                            {errorMsg &&
                                <Alert severity="error">
                                    <AlertTitle>Ошибка регистрации</AlertTitle>
                                    {errorMsg}
                                </Alert>
                            }
                            <Backdrop
                                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                open={isSubmitting}
                            >
                                <CircularProgress color="inherit" />
                            </Backdrop>
                        </>
                    )}
                </Formik>


            </Paper>
        </Container>
    )
}

export default RegistrationPage