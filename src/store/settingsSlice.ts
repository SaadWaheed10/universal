import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  DEFAULT_APP_SETTINGS,
  type AppSettings,
  type VideoQuality,
} from '../types/settings';

const STORAGE_KEY = 'universal.appSettings';

type SettingsState = AppSettings & {
  hydrated: boolean;
};

const initialState: SettingsState = {
  ...DEFAULT_APP_SETTINGS,
  hydrated: false,
};

async function persist(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function toAppSettings(state: SettingsState): AppSettings {
  return {
    clipboardWatchEnabled: state.clipboardWatchEnabled,
    autoRetryEnabled: state.autoRetryEnabled,
    videoQuality: state.videoQuality,
  };
}

export const hydrateSettings = createAsyncThunk('settings/hydrate', async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_APP_SETTINGS;
    }
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      clipboardWatchEnabled:
        typeof parsed.clipboardWatchEnabled === 'boolean'
          ? parsed.clipboardWatchEnabled
          : DEFAULT_APP_SETTINGS.clipboardWatchEnabled,
      autoRetryEnabled:
        typeof parsed.autoRetryEnabled === 'boolean'
          ? parsed.autoRetryEnabled
          : DEFAULT_APP_SETTINGS.autoRetryEnabled,
      videoQuality:
        parsed.videoQuality === '360' ||
        parsed.videoQuality === '720' ||
        parsed.videoQuality === '1080' ||
        parsed.videoQuality === 'max'
          ? parsed.videoQuality
          : DEFAULT_APP_SETTINGS.videoQuality,
    } satisfies AppSettings;
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
});

export const setClipboardWatchEnabled = createAsyncThunk(
  'settings/setClipboardWatch',
  async (enabled: boolean, { getState }) => {
    const state = getState() as { settings: SettingsState };
    const next = { ...toAppSettings(state.settings), clipboardWatchEnabled: enabled };
    await persist(next);
    return next;
  },
);

export const setAutoRetryEnabled = createAsyncThunk(
  'settings/setAutoRetry',
  async (enabled: boolean, { getState }) => {
    const state = getState() as { settings: SettingsState };
    const next = { ...toAppSettings(state.settings), autoRetryEnabled: enabled };
    await persist(next);
    return next;
  },
);

export const setVideoQuality = createAsyncThunk(
  'settings/setVideoQuality',
  async (videoQuality: VideoQuality, { getState }) => {
    const state = getState() as { settings: SettingsState };
    const next = { ...toAppSettings(state.settings), videoQuality };
    await persist(next);
    return next;
  },
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    applySettings(state, action: PayloadAction<AppSettings>) {
      state.clipboardWatchEnabled = action.payload.clipboardWatchEnabled;
      state.autoRetryEnabled = action.payload.autoRetryEnabled;
      state.videoQuality = action.payload.videoQuality;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(hydrateSettings.fulfilled, (state, action) => {
        state.clipboardWatchEnabled = action.payload.clipboardWatchEnabled;
        state.autoRetryEnabled = action.payload.autoRetryEnabled;
        state.videoQuality = action.payload.videoQuality;
        state.hydrated = true;
      })
      .addCase(hydrateSettings.rejected, state => {
        state.hydrated = true;
      })
      .addCase(setClipboardWatchEnabled.fulfilled, (state, action) => {
        state.clipboardWatchEnabled = action.payload.clipboardWatchEnabled;
      })
      .addCase(setAutoRetryEnabled.fulfilled, (state, action) => {
        state.autoRetryEnabled = action.payload.autoRetryEnabled;
      })
      .addCase(setVideoQuality.fulfilled, (state, action) => {
        state.videoQuality = action.payload.videoQuality;
      });
  },
});

export const { applySettings } = settingsSlice.actions;
export default settingsSlice.reducer;
