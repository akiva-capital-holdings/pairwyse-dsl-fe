/* eslint-disable arrow-body-style */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

interface ISession {
  address: string;
  network: boolean;
  networkName: string;
}

const initialState: ISession = {
  address: '',
  network: false,
  networkName: '',
};

export const sessionReducer = createSlice({
  name: 'session',
  initialState,
  reducers: {
    connect: (state: any, action: PayloadAction<any>) => {
      state.address = action.payload;
    },
    changeNetworkAction: (state: any, action: PayloadAction<any>) => {
      state.network = action.payload;
    },
    changeNetworkName: (state: any, action: PayloadAction<any>) => {
      state.networkName = action.payload;
    },
  },
});

export const { connect, changeNetworkAction, changeNetworkName } = sessionReducer.actions;

export const selectSession = (state: RootState) => state.session;

export default sessionReducer.reducer;
