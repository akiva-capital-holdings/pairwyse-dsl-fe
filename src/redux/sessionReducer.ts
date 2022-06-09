/* eslint-disable arrow-body-style */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

interface ISession {
    address: string
}

const initialState: ISession = {
    address: '',
}

export const sessionReducer = createSlice({
    name: 'session',
    initialState,
    reducers: {
        connect: (state: any, action: PayloadAction<any>) => {
            state.address = action.payload
        },
    },
})

export const { connect } = sessionReducer.actions

export const selectSession = (state: RootState) => state.session

export default sessionReducer.reducer
