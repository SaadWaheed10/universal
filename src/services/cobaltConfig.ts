import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_COBALT_API_BASE } from '../constants/downloadConfig';

const KEY = 'universal.cobaltApiBase';

export async function getCobaltApiBase(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem(KEY);
    const value = (stored ?? DEFAULT_COBALT_API_BASE).trim();
    if (!value) {
      return '';
    }
    return value.endsWith('/') ? value : `${value}/`;
  } catch {
    return DEFAULT_COBALT_API_BASE
      ? DEFAULT_COBALT_API_BASE.endsWith('/')
        ? DEFAULT_COBALT_API_BASE
        : `${DEFAULT_COBALT_API_BASE}/`
      : '';
  }
}

export async function setCobaltApiBase(url: string): Promise<void> {
  const trimmed = url.trim();
  if (!trimmed) {
    await AsyncStorage.removeItem(KEY);
    return;
  }
  await AsyncStorage.setItem(KEY, trimmed);
}
