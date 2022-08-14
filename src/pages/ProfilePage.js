import { Button, Card, CardContent, CardMedia, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import VerifyEmail from 'components/VerifyEmail';
import { useHttp } from 'hooks/http.hook';
import useUserFromStore from 'hooks/useUserFromStore';
import React from 'react'

function ProfilePage() {
    const user = useUserFromStore()
    const { handleLogout } = useHttp()

    return (
        <Paper elevation={3} square sx={{ p: 5 }}>
            <Typography variant="h4">
                Страница пользователя
            </Typography>

            <Card
                elevation={6}
                square
                sx={{ display: 'flex', justifyContent: 'space-evenly', p: 3 }}
            >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box mb={1}>
                        <Typography component="div" variant="h5">
                            {user.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div" lineHeight={0.75}>
                            {user.email}
                        </Typography>
                    </Box>
                    <Divider flexItem />
                    <Typography >
                        Матчей сигранно: {user.games}
                    </Typography>
                    <Typography>
                        Голов забито: {user.goals}
                    </Typography>
                    <Typography>
                        Всего побед: 0
                    </Typography>
                </CardContent>
                <Divider orientation="vertical" variant="middle" flexItem />
                <CardMedia
                    component="img"
                    sx={{ maxWidth: 200, objectFit: 'contain' }}
                    image={user.avatar}
                    alt={user.name}
                />
            </Card>


            {!user.emailVerified &&
                <Stack
                    direction='row'
                    justifyContent='space-between'
                    mt={3}
                >
                    <VerifyEmail
                        variant='outlined'
                        color='error'

                    />
                    <Button
                        onClick={handleLogout}
                        variant='outlined'
                        color='error'
                    >
                        Выйти
                    </Button>
                </Stack>
            }

        </Paper>
    )
}

export default ProfilePage