import { Paper, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './loadingToRedirect.scss'

function LoadingToRedirect({ errorMsg, route }) {
    const [count, setCount] = useState(3)
    const navigate = useNavigate()


    useEffect(() => {
        if (route) {
            const interval = setInterval(() => {
                setCount((currentCount) => --currentCount)
            }, 1000)

            count === 0 && navigate(route)
            return () => clearInterval(interval)
        }
    }, [count, navigate, route])

    return (
        <Container sx={{ pt: 5 }} >
            <Paper elevation={3} square sx={{ p: 5 }}>
                <div className="redirect__card">
                    <Typography
                        variant='h4'
                        align='center'
                    >
                        {errorMsg}
                    </Typography>
                    {route &&
                        <Typography
                            variant="h5"
                            color="text.secondary"
                            align='center'
                        >
                            Перенаправим вас через <span style={{ color: 'red' }}>{count}</span> сек.
                        </Typography>
                    }
                </div>
            </Paper>
        </Container>
    )
}

export default LoadingToRedirect