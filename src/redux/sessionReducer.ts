/* eslint-disable arrow-body-style */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

interface ISession {
    address: string,
    network: boolean
}

const initialState: ISession = {
    address: '',
    network: false,
}

export const sessionReducer = createSlice({
    name: 'session',
    initialState,
    reducers: {
        connect: (state: any, action: PayloadAction<any>) => {
            state.address = action.payload
        },
        changeNetworkAction: (state: any, action: PayloadAction<any>) => {
          state.network = action.payload
      },
    },
});

export const { connect, changeNetworkAction } = sessionReducer.actions

export const selectSession = (state: RootState) => state.session;

export default sessionReducer.reducer;
