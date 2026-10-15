import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SignInScreen, SignUpScreen } from '../screens/Auth';
import { OnboardingScreen } from '../screens/Onboarding';
import { WelcomeScreen } from '../screens/Welcome';
import { getHasOnboarded } from '../services/onboardingStorage';
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
  const [ready, setReady] = useState(false);
  const [hasOnboarded, setHasOnboardedState] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const done = await getHasOnboarded();
      if (mounted) {
        setHasOnboardedState(done);
        setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
