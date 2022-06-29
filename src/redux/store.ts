/* eslint-disable arrow-body-style */
import { AnyAction, configureStore, Reducer } from '@reduxjs/toolkit';
import { persistStore, persistCombineReducers } from 'reduxjs-toolkit-persist';
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import sessionReducer from './sessionReducer';
import utilsReducer from './utilsReducer';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const persistConfig = {
  key: 'dsl-fe',
  version: 1,
  storage,
  stateReconciler: autoMergeLevel1,
};

const persistedReducer: Reducer<any, AnyAction> = persistCombineReducers<RootState, AnyAction>(
  persistConfig,
  {
    session: sessionReducer,
    utils: utilsReducer,
  }
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
