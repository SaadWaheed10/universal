import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import type { LucideIcon } from 'lucide-react-native';
import { FolderOpen, Inbox, Settings } from 'lucide-react-native';
import { View } from 'react-native';
import { useScaledStyles, ri } from 'react-native-pixelflow';
import { Icon } from '../components';
import {
  CollectionsScreen,
  InboxScreen,
  SettingsScreen,
} from '../screens';
import { colors } from '../theme/colors';
import { createRootNavigatorStyles } from './RootNavigator.styles';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

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

function TabIcon({
  focused,
  accent,
  glyph,
}: {
  focused: boolean;
  accent: string;
  glyph: LucideIcon;
}) {
  const styles = useScaledStyles(createRootNavigatorStyles);

  return (
    <View
      style={[
        styles.tabIcon,
        focused ? styles.tabIconActive : styles.tabIconInactive,
      ]}>
      <Icon
        icon={glyph}
        size={ri(18)}
        color={focused ? accent : colors.textMuted}
        strokeWidth={focused ? 2.25 : 1.85}
      />
    </View>
  );
}

export function RootNavigator() {
  const styles = useScaledStyles(createRootNavigatorStyles);

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: styles.tabLabel,
          // Kill Android's default white ripple ("white ball") on tab press.
          tabBarButton: props => (
            <PlatformPressable
              {...props}
              pressColor="transparent"
              pressOpacity={1}
              android_ripple={null}
            />
          ),
        }}>
        <Tab.Screen
          name="Inbox"
          component={InboxScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} accent={colors.accent} glyph={Inbox} />
            ),
          }}
        />
        <Tab.Screen
          name="Collections"
          component={CollectionsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                accent={colors.accentSecondary}
                glyph={FolderOpen}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                accent={colors.accentWarm}
                glyph={Settings}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
