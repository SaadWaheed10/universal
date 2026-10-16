import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import type { LucideIcon } from 'lucide-react-native';
import { Download, FolderOpen, Settings } from 'lucide-react-native';
import { View } from 'react-native';
import { useScaledStyles, ri } from 'react-native-pixelflow';
import { Icon } from '../components';
import {
  CollectionsScreen,
  DownloadsScreen,
  SettingsScreen,
} from '../screens';
import { colors } from '../theme/colors';
import { createRootNavigatorStyles } from './RootNavigator.styles';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

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

export function MainTabsNavigator() {
  const styles = useScaledStyles(createRootNavigatorStyles);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
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
        name="Downloads"
        component={DownloadsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              accent={colors.accent}
              glyph={Download}
            />
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
  );
}
