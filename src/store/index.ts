import { configureStore } from '@reduxjs/toolkit';
import collectionsReducer from './collectionsSlice';
import downloadsReducer from './downloadsSlice';

export const store = configureStore({
  reducer: {
    downloads: downloadsReducer,
    collections: collectionsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
