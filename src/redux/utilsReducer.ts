/* eslint-disable arrow-body-style */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

interface Utils {
  onboarding?: any;
  provider: any;
}

const initialState: Utils = {
  onboarding: {},
  provider: {},
};

export const utilsReducer = createSlice({
  name: 'utils',
  initialState,
  reducers: {
    onboarding: (state: any, action: PayloadAction<any>) => {
      state.onboarding = action.payload.meta;
    },
    provider: (state: any, action: PayloadAction<any>) => {
      state.provider = action.payload;
    },
  },
});

export const { onboarding, provider } = utilsReducer.actions;

export const selectUtils = (state: RootState) => state.utils;

export default utilsReducer.reducer;
