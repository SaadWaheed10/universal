import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { LucideIcon } from 'lucide-react-native';
import {
  ClipboardCopy,
  Download,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Trash2,
  UserRound,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Pressable, Switch, Text, TextInput, View } from 'react-native';
import { useScaledStyles, ri } from 'react-native-pixelflow';
import { AppButton, AppText, Chip, Icon, Screen } from '../../components';
import { getCurrentProductPhase } from '../../constants/productPhases';
import { useAccountMode } from '../../hooks';
import type { RootStackParamList } from '../../navigation/types';
import {
  getCobaltApiBase,
  setCobaltApiBase,
} from '../../services/cobaltConfig';
import { clearLocalMediaFiles } from '../../services/localMediaCleanup';
import { resetOnboarding } from '../../services/onboardingStorage';
import { clearCollections } from '../../store/collectionsSlice';
import { clearDownloadLibrary } from '../../store/downloadsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setAutoRetryEnabled,
  setClipboardWatchEnabled,
  setVideoQuality,
} from '../../store/settingsSlice';
import { colors } from '../../theme/colors';
import { VIDEO_QUALITY_OPTIONS, type VideoQuality } from '../../types/settings';
import { createSettingsScreenStyles } from './SettingsScreen.styles';

export function SettingsScreen() {
  const styles = useScaledStyles(createSettingsScreenStyles);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { ready, isGuest } = useAccountMode();
  const phase = getCurrentProductPhase();
  const itemCount = useAppSelector(state => state.downloads.items.length);
  const collectionCount = useAppSelector(
    state => state.collections.items.length,
  );
  const clipboardWatchEnabled = useAppSelector(
    state => state.settings.clipboardWatchEnabled,
  );
  const autoRetryEnabled = useAppSelector(
    state => state.settings.autoRetryEnabled,
  );
  const videoQuality = useAppSelector(state => state.settings.videoQuality);
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

  const clearLibraryOnly = () => {
    Alert.alert(
      'Clear in-app library?',
      'Removes saved items and collections from Universal. Photos / Gallery files stay on the device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await dispatch(clearDownloadLibrary());
            await dispatch(clearCollections());
            await clearLocalMediaFiles();
          },
        },
      ],
    );
  };

  const infoRows: Array<{
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
    {
      label: 'Privacy',
      value: 'On-device + gallery only',
      icon: ShieldCheck,
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
        {infoRows.map((row, index) => (
          <View
            key={row.label}
            style={[
              styles.row,
              index === infoRows.length - 1 && styles.rowLast,
            ]}>
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

      <Text style={styles.sectionLabel}>Privacy & intake</Text>
      <View style={styles.group}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Icon
                icon={ClipboardCopy}
                size={ri(16)}
                color={colors.accent}
                strokeWidth={2}
              />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowLabel}>Clipboard watch</Text>
              <Text style={styles.rowHint}>
                Offer download when you return with a copied link
              </Text>
            </View>
          </View>
          <Switch
            value={clipboardWatchEnabled}
            onValueChange={value => {
              void dispatch(setClipboardWatchEnabled(value));
            }}
            trackColor={{ false: colors.borderSubtle, true: colors.accentMuted }}
            thumbColor={
              clipboardWatchEnabled ? colors.accent : colors.textMuted
            }
          />
        </View>
        <View style={[styles.row, styles.rowLast]}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Icon
                icon={RefreshCw}
                size={ri(16)}
                color={colors.accent}
                strokeWidth={2}
              />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowLabel}>Auto-retry</Text>
              <Text style={styles.rowHint}>
                Up to 2 retries on resolve / download failures
              </Text>
            </View>
          </View>
          <Switch
            value={autoRetryEnabled}
            onValueChange={value => {
              void dispatch(setAutoRetryEnabled(value));
            }}
            trackColor={{ false: colors.borderSubtle, true: colors.accentMuted }}
            thumbColor={autoRetryEnabled ? colors.accent : colors.textMuted}
          />
        </View>
      </View>

      <Text style={styles.sectionLabel}>Default quality</Text>
      <View style={styles.qualityWrap}>
        {VIDEO_QUALITY_OPTIONS.map(option => (
          <Chip
            key={option.value}
            label={option.label}
            selected={videoQuality === option.value}
            onPress={() => {
              void dispatch(setVideoQuality(option.value as VideoQuality));
            }}
          />
        ))}
      </View>
      <Text style={styles.helper}>
        Used for Cobalt social downloads. You can also change it on the Add
        Download screen.
      </Text>

      <Text style={styles.sectionLabel}>Data</Text>
      <Pressable onPress={clearLibraryOnly} style={styles.group}>
        <View style={[styles.row, styles.rowLast]}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Icon
                icon={Trash2}
                size={ri(16)}
                color={colors.danger}
                strokeWidth={2}
              />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowLabel}>Clear library & collections</Text>
              <Text style={styles.rowHint}>
                {itemCount + collectionCount > 0
                  ? `${itemCount} items · ${collectionCount} collections`
                  : 'Nothing stored in-app'}
              </Text>
            </View>
          </View>
          <Text style={styles.rowValue}>Clear</Text>
        </View>
      </Pressable>
      <Text style={styles.helper}>
        Never deletes Photos / Gallery copies. Clears in-app playback files
        only.
      </Text>

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
        API base URL here. On Android, share a link into Universal via the
        system share sheet.
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
