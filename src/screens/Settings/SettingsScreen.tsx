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
import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { useScaledStyles, ri } from 'react-native-pixelflow';
import { AppButton, AppText, Icon, Screen } from '../../components';
import { getCurrentProductPhase } from '../../constants/productPhases';
import { useAccountMode } from '../../hooks';
import type { RootStackParamList } from '../../navigation/types';
import {
  getCobaltApiBase,
  setCobaltApiBase,
} from '../../services/cobaltConfig';
import { resetOnboarding } from '../../services/onboardingStorage';
import { clearDownloadLibrary } from '../../store/downloadsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { colors } from '../../theme/colors';
import { createSettingsScreenStyles } from './SettingsScreen.styles';

export function SettingsScreen() {
  const styles = useScaledStyles(createSettingsScreenStyles);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { ready, isGuest } = useAccountMode();
  const phase = getCurrentProductPhase();
  const itemCount = useAppSelector(state => state.downloads.items.length);
  const [cobaltUrl, setCobaltUrl] = useState('');
  const [cobaltSaved, setCobaltSaved] = useState(false);

  useEffect(() => {
    getCobaltApiBase().then(setCobaltUrl);
  }, []);

  const saveCobalt = async () => {
    await setCobaltApiBase(cobaltUrl);
    setCobaltSaved(true);
    setTimeout(() => setCobaltSaved(false), 1600);
  };

  const clearData = () => {
    Alert.alert(
      'Clear in-app library?',
      'Removes saved items from Universal. Files already in Photos / Gallery stay on the device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            dispatch(clearDownloadLibrary());
          },
        },
      ],
    );
  };

  const rows: Array<{
    label: string;
    value: string;
    icon: LucideIcon;
    onPress?: () => void;
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
    {
      label: 'Clear library',
      value: itemCount > 0 ? `${itemCount} items` : '—',
      icon: Trash2,
      onPress: clearData,
    },
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
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Preferences</Text>
        <AppText variant="title">Settings</AppText>
      </View>

      <View style={styles.group}>
        {rows.map((row, index) => {
          const rowStyle = [
            styles.row,
            index === rows.length - 1 && styles.rowLast,
          ];
          const content = (
            <>
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
            </>
          );

          return row.onPress ? (
            <Pressable key={row.label} onPress={row.onPress} style={rowStyle}>
              {content}
            </Pressable>
          ) : (
            <View key={row.label} style={rowStyle}>
              {content}
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>Cobalt API</Text>
      <TextInput
        value={cobaltUrl}
        onChangeText={setCobaltUrl}
        placeholder="https://your-cobalt-instance/"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />
      <AppButton
        label={cobaltSaved ? 'Saved' : 'Save Cobalt API URL'}
        variant="secondary"
        onPress={saveCobalt}
      />
      <Text style={styles.helper}>
        Required for Instagram / TikTok / YouTube / X. Official cobalt.tools
        blocks third-party apps — host your own Cobalt instance and paste the
        API base URL here.
      </Text>

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
        Guest saves go to Photos / Gallery only. Accounts keep an in-app grid.
      </AppText>
    </Screen>
  );
}
