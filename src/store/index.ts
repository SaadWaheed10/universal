import { configureStore } from '@reduxjs/toolkit';
import downloadsReducer from './downloadsSlice';

export const store = configureStore({
  reducer: {
    downloads: downloadsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
