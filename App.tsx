/**
 * Universal — social media download → gallery.
 * @format
 */

import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PixelFlowProvider } from 'react-native-pixelflow';
import { Provider } from 'react-redux';
import { hideSplash } from 'react-native-splash-view';
import { AppNavigator } from './src/navigation';
import { store } from './src/store';
import { colors, universalTheme } from './src/theme';

function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      hideSplash();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
        <SafeAreaProvider>
          <PixelFlowProvider theme={universalTheme}>
            <StatusBar barStyle="light-content" />
            <AppNavigator />
          </PixelFlowProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

export default App;
