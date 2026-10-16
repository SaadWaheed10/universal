import Clipboard from '@react-native-clipboard/clipboard';
import type { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { Alert, AppState, type AppStateStatus } from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import { useAppSelector } from '../store/hooks';
import {
  extractHttpUrl,
  looksLikeDownloadableLink,
} from '../utils/shareIntake';

type NavRef = NavigationContainerRefWithCurrent<RootStackParamList>;

/**
 * When enabled, foregrounding the app checks the clipboard for a social /
 * media URL and offers to open Add Download (privacy: toggle in Settings).
 */
export function useClipboardWatch(
  enabled: boolean,
  navigationRef: NavRef,
) {
  const clipboardWatchEnabled = useAppSelector(
    state => state.settings.clipboardWatchEnabled,
  );
  const lastOfferedRef = useRef<string | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    if (!enabled || !clipboardWatchEnabled) {
      return;
    }

    const maybeOffer = async () => {
      try {
        const clip = await Clipboard.getString();
        const url = extractHttpUrl(clip ?? '');
        if (!url || !looksLikeDownloadableLink(url)) {
          return;
        }
        if (lastOfferedRef.current === url) {
          return;
        }
        lastOfferedRef.current = url;
        Alert.alert(
          'Download this link?',
          url.length > 120 ? `${url.slice(0, 117)}…` : url,
          [
            { text: 'Not now', style: 'cancel' },
            {
              text: 'Open',
              onPress: () => {
                if (navigationRef.isReady()) {
                  navigationRef.navigate('AddDownload', { initialUrl: url });
                }
              },
            },
          ],
        );
      } catch {
        // Clipboard denied / empty — ignore.
      }
    };

    const onChange = (next: AppStateStatus) => {
      const wasBackground =
        appStateRef.current === 'background' ||
        appStateRef.current === 'inactive';
      appStateRef.current = next;
      if (wasBackground && next === 'active') {
        void maybeOffer();
      }
    };

    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [clipboardWatchEnabled, enabled, navigationRef]);
}
