import { configureStore } from '@reduxjs/toolkit';
import user from './slices/userSlice'
import nextGame from './slices/gameSlice'


const store = configureStore({
    reducer: {
        user,
        nextGame
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production'
})

export default store;