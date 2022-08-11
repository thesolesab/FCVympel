import { Avatar, Badge, Card, CardContent, CardMedia, CircularProgress, Divider, Typography } from '@mui/material'
import { defaultAvatar } from 'constants'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { useUserFromDb } from '../firebase1';

function PlayerCard({ user }) {
    const [player, loading] = useUserFromDb(user.id)

    return (
        <Card
            elevation={6}
            // square
            sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                p: 1
            }}
        >
            {loading ?
                <CircularProgress color="inherit" />
                :
                <>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 0 }}>
                        <Typography component="div" variant="subtitle">
                            {player?.name || user.name || "Игрок неведимка"}
                        </Typography>
                        <Divider flexItem />
                        <Typography>
                            {user?.legioner ? 'Легионер' : `Всего побед: ${player?.totalWins || '0'}`}
                        </Typography>
                    </CardContent>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <CardMedia>
                        <Badge
                            badgeContent={<><SportsSoccerIcon sx={{ fontSize: 15 }} /> {player?.goals}</>}
                            color="secondary"
                            invisible={!player?.goals > 0}
                        >
                            <Avatar
                                alt={player?.name || 'user'}
                                variant="rounded"
                                sx={{ width: 45, height: 45 }}
                                imgProps={{
                                    sx: {
                                        objectFit: 'contain',
                                    }
                                }}
                                src={player?.avatar || defaultAvatar}
                            />
                        </Badge>
                    </CardMedia>
                </>
            }
        </Card>
    )
}

export default PlayerCard