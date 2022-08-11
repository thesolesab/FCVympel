import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const userAdapter = createEntityAdapter()
const initialState = userAdapter.getInitialState()


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userLogin: (state, action) => {
            userAdapter.setOne(state, action.payload)
        },
        userLogout: (state) => {
            userAdapter.removeAll(state)
        }
    },
})

const { actions, reducer } = userSlice

export default reducer

export const { selectAll: selectUser, selectById } = userAdapter.getSelectors(state => state.user)

export const { userLogin, userLogout } = actions