import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './Reducers';
import { NODE_ENV } from '../../config';

export const store = configureStore({
  reducer: rootReducer,
  devTools: NODE_ENV === 'local',
});

export const dispatch = store.dispatch;