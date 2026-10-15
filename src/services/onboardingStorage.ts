import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  hasOnboarded: 'universal.hasOnboarded',
  isGuest: 'universal.isGuest',
} as const;

export async function getHasOnboarded(): Promise<boolean> {
  const value = await AsyncStorage.getItem(KEYS.hasOnboarded);
  return value === 'true';
}

export async function setHasOnboarded(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.hasOnboarded, value ? 'true' : 'false');
}

export async function setIsGuest(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.isGuest, value ? 'true' : 'false');
}

export async function getIsGuest(): Promise<boolean> {
  const value = await AsyncStorage.getItem(KEYS.isGuest);
  return value === 'true';
}

/** Dev / Settings helper — show onboarding again on next launch. */
export async function resetOnboarding(): Promise<void> {
  // AsyncStorage v3 uses removeMany (multiRemove was removed).
  await AsyncStorage.removeMany([KEYS.hasOnboarded, KEYS.isGuest]);
}
