import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { LucideIcon } from 'lucide-react-native';
import {
  ClipboardCopy,
  Download,
  RotateCcw,
  ShieldCheck,
  Trash2,
  UserRound,
} from 'lucide-react-native';
import { Alert, Pressable, Text, View } from 'react-native';
import { useScaledStyles, ri } from 'react-native-pixelflow';
import { AppText, Icon, Screen } from '../../components';
import { getCurrentProductPhase } from '../../constants/productPhases';
import { useAccountMode } from '../../hooks';
import type { RootStackParamList } from '../../navigation/types';
import { resetOnboarding } from '../../services/onboardingStorage';
import { colors } from '../../theme/colors';
import { createSettingsScreenStyles } from './SettingsScreen.styles';

export function SettingsScreen() {
  const styles = useScaledStyles(createSettingsScreenStyles);
  const navigation = useNavigation();
  const { ready, isGuest } = useAccountMode();
  const phase = getCurrentProductPhase();

  const rows: Array<{
    label: string;
    value: string;
    icon: LucideIcon;
  }> = [
    {
      label: 'Account',
      value: ready ? (isGuest ? 'Guest' : 'Registered') : '…',
      icon: UserRound,
    },
    {
      label: 'Product phase',
      value: `${phase.id} · ${phase.title}`,
      icon: Download,
    },
    { label: 'Clipboard watch', value: 'Coming soon', icon: ClipboardCopy },
    {
      label: 'Privacy',
      value: 'On-device + gallery',
      icon: ShieldCheck,
    },
    { label: 'Clear data', value: '—', icon: Trash2 },
  ];

  const replayOnboarding = () => {
    Alert.alert(
      'Replay onboarding?',
      'You will see the intro screens again on the next step.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Replay',
          onPress: async () => {
            await resetOnboarding();
            const root =
              navigation.getParent<
                NativeStackNavigationProp<RootStackParamList>
              >();
            root?.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Preferences</Text>
        <AppText variant="title">Settings</AppText>
      </View>

      <View style={styles.group}>
        {rows.map((row, index) => (
          <View
            key={row.label}
            style={[styles.row, index === rows.length - 1 && styles.rowLast]}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <Icon
                  icon={row.icon}
                  size={ri(16)}
                  color={colors.accent}
                  strokeWidth={2}
                />
              </View>
              <Text style={styles.rowLabel}>{row.label}</Text>
            </View>
            <Text style={styles.rowValue}>{row.value}</Text>
          </View>
        ))}
      </View>

      <Pressable onPress={replayOnboarding} style={styles.group}>
        <View style={[styles.row, styles.rowLast]}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Icon
                icon={RotateCcw}
                size={ri(16)}
                color={colors.accentWarm}
                strokeWidth={2}
              />
            </View>
            <Text style={styles.rowLabel}>Replay onboarding</Text>
          </View>
          <Text style={styles.rowValue}>Reset</Text>
        </View>
      </Pressable>

      <AppText variant="caption" style={styles.footer}>
        Guest saves go to Photos / Gallery only. Accounts unlock the in-app
        grid. Full download pipeline is Phase 2 (iOS + Android).
      </AppText>
    </Screen>
  );
}
