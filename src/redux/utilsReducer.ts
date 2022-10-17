import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

interface Utils {
  provider: any;
}

const initialState: Utils = {
  provider: {},
};

export const utilsReducer = createSlice({
  name: 'utils',
  initialState,
  reducers: {
    provider: (state, action: PayloadAction<any>) => {
      state.provider = action.payload;
    },
  }
});

export const { provider } = utilsReducer.actions;

export const selectUtils = (state: RootState) => {
  return state.utils;
};

export default utilsReducer.reducer;
