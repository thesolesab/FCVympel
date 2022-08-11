import { Avatar } from '@mui/material';
import { defaultAvatar } from 'constants';
import { useUserFromDb } from 'firebase1'
import React from 'react'

export const PlayerAvatar = ({ user }) => {
    const [player] = useUserFromDb(user.id)

    return (
        <Avatar alt={player?.name || user.name} src={player?.avatar || defaultAvatar} />
    )
}
