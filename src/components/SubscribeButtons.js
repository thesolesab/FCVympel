import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { deletePlayer, setPlayer } from 'firebase1'
import useUserFromStore from 'hooks/useUserFromStore'
import React from 'react'
import VerifyEmail from './VerifyEmail'

const SubscribeButtons = ({ players }) => {
    const { id, name, emailVerified } = useUserFromStore()


    async function handleSubscribe() {
        await setPlayer({ id, name })
    }

    async function handleUnsubscribe() {
        await deletePlayer(name)
    }

    if (players.map(el => el.id).includes(id)) {
        return (
            <Button
                onClick={handleUnsubscribe}
                color='error'
            >
                Выписаться
            </Button>
        )
    } else {
        if (!emailVerified) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'baseline'
                    }}
                >
                    <Typography>Для записи вам нужно</Typography>
                    <VerifyEmail color='warning' />
                </Box >
            )
        }
        return (
            <Button
                onClick={handleSubscribe}
                color='success'
            >
                Записаться
            </Button>
        )
    }
}

export default SubscribeButtons