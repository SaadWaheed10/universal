/**
 * Universal — local-first social link inbox.
 * @format
 */

import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PixelFlowProvider } from 'react-native-pixelflow';
import { hideSplash } from 'react-native-splash-view';
import { RootNavigator } from './src/navigation';
import { colors, universalTheme } from './src/theme';

function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      hideSplash();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <PixelFlowProvider theme={universalTheme}>
          <StatusBar barStyle="light-content" />
          <RootNavigator />
        </PixelFlowProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
