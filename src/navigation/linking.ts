import type { LinkingOptions } from '@react-navigation/native';
import { Linking } from 'react-native';
import type { RootStackParamList } from './types';

/**
 * Deep links:
 * - universal://add?initialUrl=<encoded url>
 * Android share sheet rewrites ACTION_SEND text into this scheme.
 */
export const appLinking: LinkingOptions<RootStackParamList> = {
  prefixes: ['universal://'],
  config: {
    screens: {
      AddDownload: {
        path: 'add',
        parse: {
          initialUrl: (value: string) => {
            try {
              return decodeURIComponent(value);
            } catch {
              return value;
            }
          },
        },
      },
      MainTabs: {
        path: '',
        screens: {
          Downloads: 'downloads',
          Collections: 'collections',
          Settings: 'settings',
        },
      },
    },
  },
  async getInitialURL() {
    return Linking.getInitialURL();
  },
  subscribe(listener) {
    const sub = Linking.addEventListener('url', ({ url }) => listener(url));
    return () => sub.remove();
  },
};
