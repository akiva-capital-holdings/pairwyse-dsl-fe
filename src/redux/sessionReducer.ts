import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

interface ISession {
    onboarding?: any
    provider: any
    address: string
}

const initialState: ISession = {
    onboarding: undefined,
    provider: undefined,
    address: '',
}

export const sessionReducer = createSlice({
    name: 'session',
    initialState,
    reducers: {
        onboarding: (state: any, action: PayloadAction<any>) => {
            state.onboarding = action.payload.meta
        },
        provider: (state: any, action: PayloadAction<any>) => {
            state.provider = action.payload
        },
        connect: (state: any, action: PayloadAction<any>) => {
            state.address = action.payload
        },
        logoutWallet: (state: any) => {
            state.onboarding = initialState.onboarding
            state.provider = initialState.provider
        },
    },
})

export const { onboarding, provider, logoutWallet, connect } = sessionReducer.actions

export const selectSession = (state: RootState) => state.session

export default sessionReducer.reducer
