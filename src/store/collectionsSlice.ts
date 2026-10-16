import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Collection } from '../types';

const STORAGE_KEY = 'universal.collections';

type CollectionsState = {
  items: Collection[];
  hydrated: boolean;
};

const initialState: CollectionsState = {
  items: [],
  hydrated: false,
};

async function persist(items: Collection[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function createId(): string {
  return `col_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export const hydrateCollections = createAsyncThunk(
  'collections/hydrate',
  async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const items: Collection[] = raw ? JSON.parse(raw) : [];
      return Array.isArray(items) ? items : [];
    } catch {
      return [] as Collection[];
    }
  },
);

export const createCollection = createAsyncThunk(
  'collections/create',
  async (title: string, { getState }) => {
    const trimmed = title.trim();
    if (!trimmed) {
      throw new Error('Collection name is required.');
    }
    const state = getState() as { collections: CollectionsState };
    const next: Collection[] = [
      {
        id: createId(),
        title: trimmed,
        createdAt: new Date().toISOString(),
      },
      ...state.collections.items,
    ];
    await persist(next);
    return next;
  },
);

export const renameCollection = createAsyncThunk(
  'collections/rename',
  async (
    payload: { id: string; title: string },
    { getState },
  ) => {
    const trimmed = payload.title.trim();
    if (!trimmed) {
      throw new Error('Collection name is required.');
    }
    const state = getState() as { collections: CollectionsState };
    const next = state.collections.items.map(item =>
      item.id === payload.id ? { ...item, title: trimmed } : item,
    );
    await persist(next);
    return next;
  },
);

export const deleteCollection = createAsyncThunk(
  'collections/delete',
  async (id: string, { getState }) => {
    const state = getState() as { collections: CollectionsState };
    const next = state.collections.items.filter(item => item.id !== id);
    await persist(next);
    return { collections: next, removedId: id };
  },
);

export const clearCollections = createAsyncThunk(
  'collections/clearAll',
  async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return [] as Collection[];
  },
);

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(hydrateCollections.fulfilled, (state, action) => {
        state.items = action.payload;
        state.hydrated = true;
      })
      .addCase(hydrateCollections.rejected, state => {
        state.items = [];
        state.hydrated = true;
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(renameCollection.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.items = action.payload.collections;
      })
      .addCase(clearCollections.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default collectionsSlice.reducer;
