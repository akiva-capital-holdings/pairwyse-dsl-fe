import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Web3 from 'web3';
import { Utils } from '../types';
import type { RootState } from './store';

const initialState: Utils = {
  utilsProvider: {},
};

export const utilsReducer = createSlice({
  name: 'utils',
  initialState,
  reducers: {
    utilsProvider: (state, action: PayloadAction<Web3>) => {
      state.utilsProvider = action.payload;
    },
  },
});

export const { utilsProvider } = utilsReducer.actions;

export const selectUtils = (state: RootState) => {
  return state.utils;
};

export default utilsReducer.reducer;
