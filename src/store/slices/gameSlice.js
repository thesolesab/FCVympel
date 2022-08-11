import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const gameAdapter = createEntityAdapter()
const initialState = gameAdapter.getInitialState()

const gameSlice = createSlice({
    name: 'nextGame',
    initialState,
    reducers: {
        setNextGame: (state, action) => {
            gameAdapter.setOne(state, action.payload)
        }
    },
})

const { actions, reducer } = gameSlice

export default reducer

export const { selectAll: selectNextGame, selectById } = gameAdapter.getSelectors(state => state.nextGame)

export const { setNextGame } = actions