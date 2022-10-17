import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

interface ISession {
  network: boolean;
  agreementAddress: string;
}

const initialState: ISession = {
  network: false,
  agreementAddress: '',
};

export const sessionReducer = createSlice({
  name: 'session',
  initialState,
  reducers: {
    changeNetworkAction: (state: RootState, action: PayloadAction<boolean>) => {
      state.network = action.payload;
    },
    changeAgreementAddress: (state: RootState, action: PayloadAction<string>) => {
      state.agreementAddress = action.payload;
    },
  },
});

export const { changeNetworkAction, changeAgreementAddress } =
  sessionReducer.actions;

export const selectSession = (state: RootState) => {
  return state.session;
};

export default sessionReducer.reducer;
