import { configureStore } from '@reduxjs/toolkit';
import collectionsReducer from './collectionsSlice';
import downloadsReducer from './downloadsSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    downloads: downloadsReducer,
    collections: collectionsReducer,
    settings: settingsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
