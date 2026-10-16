import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { getIsGuest } from '../services/onboardingStorage';

export type AccountMode = {
  ready: boolean;
  isGuest: boolean;
  /** Registered (or signed-in shell) — full in-app library. */
  hasLibrary: boolean;
  refresh: () => Promise<void>;
};

/**
 * Guest = gallery-only (no lasting in-app archive).
 * Registered = Instagram-style grid library.
 */
export function useAccountMode(): AccountMode {
  const [ready, setReady] = useState(false);
  const [isGuest, setIsGuestState] = useState(true);

  const refresh = useCallback(async () => {
    const guest = await getIsGuest();
    setIsGuestState(guest);
    setReady(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return {
    ready,
    isGuest,
    hasLibrary: ready && !isGuest,
    refresh,
  };
}
