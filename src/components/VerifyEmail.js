import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from "@mui/material"
import { forwardRef, useEffect, useState } from "react"
import { verifyEmail } from "../firebase1"

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function VerifyEmail(props) {
    const [backdropOpen, setBackdropOpen] = useState(false)

    async function handleVerifyEmail() {
        setBackdropOpen(true)
        await verifyEmail()
            .then(el => console.log(el))
    }

    const handleClose = () => {
        setBackdropOpen(false);
    }

    useEffect(() => { console.log('render') }, [])

    return (
        <>
            <Dialog
                open={backdropOpen}
                TransitionComponent={Transition}
                keepMounted
                // onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Письмо было отправленно на вашу почту"}</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        Проверьте почту и перейдите по ссылке
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='secondary'>Хорошо</Button>
                </DialogActions>
            </Dialog>
            <Button
                {...props}
                onClick={handleVerifyEmail}
            >
                Подтвердить почту
            </Button>
        </>
    )
}

export default VerifyEmail