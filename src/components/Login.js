import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Divider,
    TextField,
    Typography
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom'
import { useState } from 'react';
import { googleAuth, login } from '../firebase1';

// const Transition = forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />
// })

const Login = ({ openDialog, handleCloseDialog }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation()
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState({
        email: '',
        password: ''
    })


    const [errorText, setErrorText] = useState({
        email: '',
        password: ''
    })

    async function handleSignupGoogle() {
        await googleAuth().then(() => {
            handleCloseDialog()
            if (pathname === '/registration') {
                navigate("/")
            }
        })
    }

    async function handleLogin() {
        setLoading(true)

        try {
            await login(values.email, values.password).then(() => { handleCloseDialog() })
        } catch (error) {
            console.log(error.message);
            switch (error.message) {
                case 'Firebase: Error (auth/user-not-found).':
                    setErrorText({ ...errorText, email: 'Такого пользователя не существует' })
                    break;
                case 'Firebase: Error (auth/wrong-password).':
                    setErrorText({ ...errorText, password: 'Неверный пароль' })
                    break;
                case 'Firebase: Error (auth/invalid-email).':
                    setErrorText({ ...errorText, email: 'Введите Email' })
                    break;
                default:
                    window.alert('Что то пошло не так, попробуйте позже.')
                    handleCloseDialog()
                    break;
            }
        }
        setLoading(false)
    }

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.id]: e.target.value,
        })
        if (e.target.value.length === 0) {
            setErrorText({
                ...errorText,
                [e.target.id]: 'Данное поле обязательно'
            })
        } else {
            setErrorText({
                ...errorText,
                [e.target.id]: ''
            })
        }
    }

    return (
        <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            // TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
            fullWidth
        >
            <Button
                color='error'
                onClick={handleSignupGoogle}
            >
                <GoogleIcon fontSize="small" sx={{ mr: "3" }} />
                Войти через Google
            </Button>
            <Divider />
            <DialogContent>
                <DialogContentText color="primary.text">
                    Войти через Email и пароль
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    fullWidth
                    label="Email"
                    id="email"
                    type="email"
                    variant="standard"
                    error={!!errorText.email}
                    helperText={errorText.email}
                    value={values.email}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    fullWidth
                    label="Пароль"
                    id="password"
                    type="password"
                    variant="standard"
                    error={!!errorText.password}
                    helperText={errorText.password}
                    value={values.password}
                    onChange={handleChange}
                />

            </DialogContent>
            <DialogActions sx={{ p: '24px', pt: 0, justifyContent: "space-between" }}>
                <Typography >
                    Нет аккаунта?
                    <Link
                        color="error"
                        component={RouterLink}
                        to="/registration"
                        onClick={handleCloseDialog}
                    >
                        Зарегестрируйся
                    </Link>
                </Typography>
                <Button
                    onClick={handleLogin}
                    variant='contained'
                    color="success"
                    disabled={loading}
                >
                    Войти
                </Button>
            </DialogActions>
        </Dialog >
    )
}

export default Login