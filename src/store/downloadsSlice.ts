import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { DownloadItem } from '../types';

const STORAGE_KEY = 'universal.downloads.library';

type DownloadsState = {
  items: DownloadItem[];
  hydrated: boolean;
};

const initialState: DownloadsState = {
  items: [],
  hydrated: false,
};

async function persist(items: DownloadItem[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const hydrateDownloads = createAsyncThunk(
  'downloads/hydrate',
  async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const items: DownloadItem[] = raw ? JSON.parse(raw) : [];
      return Array.isArray(items) ? items : [];
    } catch {
      return [] as DownloadItem[];
    }
  },
);

export const addDownloadItem = createAsyncThunk(
  'downloads/addItem',
  async (item: DownloadItem, { getState }) => {
    const state = getState() as { downloads: DownloadsState };
    const next = [
      item,
      ...state.downloads.items.filter(existing => existing.id !== item.id),
    ];
    await persist(next);
    return next;
  },
);

export const removeDownloadItem = createAsyncThunk(
  'downloads/removeItem',
  async (id: string, { getState }) => {
    const state = getState() as { downloads: DownloadsState };
    const next = state.downloads.items.filter(item => item.id !== id);
    await persist(next);
    return next;
  },
);

export const clearDownloadLibrary = createAsyncThunk(
  'downloads/clearLibrary',
  async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return [] as DownloadItem[];
  },
);

const downloadsSlice = createSlice({
  name: 'downloads',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(hydrateDownloads.fulfilled, (state, action) => {
        state.items = action.payload;
        state.hydrated = true;
      })
      .addCase(hydrateDownloads.rejected, state => {
        state.items = [];
        state.hydrated = true;
      })
      .addCase(addDownloadItem.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeDownloadItem.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(clearDownloadLibrary.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default downloadsSlice.reducer;
