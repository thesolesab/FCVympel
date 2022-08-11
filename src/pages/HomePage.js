import { Avatar, Container, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useUserFromStore from 'hooks/useUserFromStore'
import VerifyEmail from 'components/VerifyEmail'

function HomePage() {
    const { name, avatar } = useUserFromStore()
    const [count, setCount] = useState(5)


    useEffect(() => {
        if (name) {
            const interval = setInterval(() => {
                setCount((currentCount) => --currentCount)
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [count, name])


    return (
        <Container maxWidth="xl">
            {name && count > 0 &&
                <Typography
                    variant='h5'
                    align='center'
                >
                    Hello <span style={{ color: "green" }}>{name}</span>
                    <Avatar
                        alt={name || 'user'}
                        variant="rounded"
                        imgProps={{
                            sx: {
                                objectFit: 'contain',
                            }
                        }}
                        src={avatar}
                    />

                </Typography>
            }

        </Container >
    )
}

export default HomePage