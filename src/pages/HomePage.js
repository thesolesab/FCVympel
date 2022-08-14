import { Avatar, Container, Stack, Typography, Zoom } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useUserFromStore from 'hooks/useUserFromStore'

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
                <Zoom in={count > 0}>
                    <Stack
                        mt={5}
                        direction='row'
                        justifyContent='center'
                        spacing={2}
                    >
                        <Typography
                            variant='h5'
                            align='center'
                        >
                            Hello <span style={{ color: "green" }}>{name}</span>
                        </Typography>
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
                    </Stack>
                </Zoom>
            }

        </Container >
    )
}

export default HomePage