import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AddDownloadScreen } from '../screens/AddDownload';
import { SignInScreen, SignUpScreen } from '../screens/Auth';
import { CollectionDetailScreen } from '../screens/CollectionDetail';
import { DownloadDetailScreen } from '../screens/DownloadDetail';
import { OnboardingScreen } from '../screens/Onboarding';
import { WelcomeScreen } from '../screens/Welcome';
import { getHasOnboarded } from '../services/onboardingStorage';
import { hydrateCollections } from '../store/collectionsSlice';
import { hydrateDownloads } from '../store/downloadsSlice';
import { useAppDispatch } from '../store/hooks';
import { colors } from '../theme/colors';
import { MainTabsNavigator } from './MainTabsNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.borderSubtle,
    primary: colors.accent,
  },
};

export function AppNavigator() {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);
  const [hasOnboarded, setHasOnboardedState] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const done = await getHasOnboarded();
      await Promise.all([
        dispatch(hydrateDownloads()),
        dispatch(hydrateCollections()),
      ]);
      if (mounted) {
        setHasOnboardedState(done);
        setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.bg,
        }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName={hasOnboarded ? 'MainTabs' : 'Onboarding'}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'fade',
        }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
        <Stack.Screen
          name="AddDownload"
          component={AddDownloadScreen}
          options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
        />
        <Stack.Screen
          name="DownloadDetail"
          component={DownloadDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="CollectionDetail"
          component={CollectionDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
