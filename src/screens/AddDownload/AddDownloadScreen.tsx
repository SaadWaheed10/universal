import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Clipboard from '@react-native-clipboard/clipboard';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useScaledStyles } from 'react-native-pixelflow';
import { AppButton, Chip, Screen } from '../../components';
import { PLATFORM_LABELS, PLATFORM_PIP } from '../../constants/platforms';
import type { RootStackParamList } from '../../navigation/types';
import {
  runDownloadPipeline,
  type DownloadProgress,
} from '../../services/downloadPipeline';
import { getIsGuest } from '../../services/onboardingStorage';
import { addDownloadItem } from '../../store/downloadsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setVideoQuality } from '../../store/settingsSlice';
import { colors } from '../../theme/colors';
import { VIDEO_QUALITY_OPTIONS, type VideoQuality } from '../../types/settings';
import { detectPlatform } from '../../utils/platformDetect';
import {
  extractHttpUrl,
  looksLikeDownloadableLink,
} from '../../utils/shareIntake';
import { isValidHttpUrl } from '../../utils/url';
import { createAddDownloadScreenStyles } from './AddDownloadScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AddDownload'>;

export function AddDownloadScreen({ navigation, route }: Props) {
  const styles = useScaledStyles(createAddDownloadScreenStyles);
  const dispatch = useAppDispatch();
  const videoQuality = useAppSelector(state => state.settings.videoQuality);
  const autoRetryEnabled = useAppSelector(
    state => state.settings.autoRetryEnabled,
  );
  const [url, setUrl] = useState(route.params?.initialUrl?.trim() ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);

  const platform = useMemo(
    () => (url.trim() ? detectPlatform(url) : null),
    [url],
  );

  useEffect(() => {
    const incoming = route.params?.initialUrl?.trim();
    if (incoming) {
      setUrl(incoming);
      setError(null);
      setSuccess(null);
    }
  }, [route.params?.initialUrl]);

  useEffect(() => {
    if (route.params?.initialUrl) {
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const clip = await Clipboard.getString();
        const found = extractHttpUrl(clip ?? '');
        if (
          mounted &&
          !url &&
          found &&
          looksLikeDownloadableLink(found)
        ) {
          setUrl(found);
        }
      } catch {
        // Clipboard may be empty / denied — ignore.
      }
    })();
    return () => {
      mounted = false;
    };
    // Prefill once on mount when no deep-link URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pasteFromClipboard = async () => {
    try {
      const clip = await Clipboard.getString();
      const found = extractHttpUrl(clip ?? '') ?? clip?.trim();
      if (!found) {
        Alert.alert('Clipboard empty', 'Copy a link first, then paste here.');
        return;
      }
      setUrl(found);
      setError(null);
      setSuccess(null);
    } catch {
      Alert.alert('Clipboard', 'Could not read the clipboard.');
    }
  };

  const startDownload = async () => {
    if (!isValidHttpUrl(url)) {
      setError('Enter a valid http(s) link.');
      return;
    }

    setBusy(true);
    setError(null);
    setSuccess(null);
    setProgress({
      phase: 'resolving',
      ratio: 0.02,
      message: 'Starting…',
    });

    try {
      const isGuest = await getIsGuest();
      const result = await runDownloadPipeline({
        rawUrl: url,
        persistInLibrary: !isGuest,
        videoQuality,
        maxAttempts: autoRetryEnabled ? 3 : 1,
        onProgress: setProgress,
      });

      if (!isGuest) {
        await dispatch(addDownloadItem(result.item));
      }

      const galleryName = Platform.OS === 'ios' ? 'Photos' : 'Gallery';
      setSuccess(
        isGuest
          ? `Saved to ${galleryName}. Guest mode keeps no in-app archive.`
          : `Saved to ${galleryName} and your in-app library.`,
      );
      setProgress({
        phase: 'done',
        ratio: 1,
        message: `Saved to ${galleryName}`,
      });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Download failed. Please try again.';
      setError(message);
      setProgress({
        phase: 'error',
        ratio: 0,
        message: 'Failed',
      });
    } finally {
      setBusy(false);
    }
  };

  const onQuality = (value: VideoQuality) => {
    void dispatch(setVideoQuality(value));
  };

  const primaryLabel = busy
    ? 'Working…'
    : error
      ? 'Retry download'
      : 'Download & save';

  return (
    <Screen scroll>
      <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
        <Text style={styles.back}>Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Paste a link</Text>
        <Text style={styles.subtitle}>
          We resolve the media, download it, and save it to{' '}
          {Platform.OS === 'ios' ? 'Photos' : 'Gallery'} on this device.
        </Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Link</Text>
        <TextInput
          value={url}
          onChangeText={text => {
            setUrl(text);
            setError(null);
            setSuccess(null);
          }}
          placeholder="https://…"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          multiline
          editable={!busy}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Quality</Text>
        <View style={styles.qualityRow}>
          {VIDEO_QUALITY_OPTIONS.map(option => (
            <Chip
              key={option.value}
              label={option.label}
              selected={videoQuality === option.value}
              onPress={() => onQuality(option.value)}
            />
          ))}
        </View>
      </View>

      {platform ? (
        <View style={styles.platformRow}>
          <Chip
            label={PLATFORM_LABELS[platform]}
            pipColor={PLATFORM_PIP[platform]}
          />
          <Text style={styles.platformHint}>Detected platform</Text>
        </View>
      ) : null}

      {progress ? (
        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>{progress.message}</Text>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { width: `${Math.round(progress.ratio * 100)}%` },
              ]}
            />
          </View>
        </View>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <View style={styles.actions}>
        <AppButton
          label={primaryLabel}
          onPress={startDownload}
          disabled={busy}
        />
        <AppButton
          label="Paste from clipboard"
          variant="secondary"
          onPress={pasteFromClipboard}
          disabled={busy}
        />
      </View>

      <Text style={styles.note}>
        Social links need a Cobalt API (Settings → Cobalt API). Direct .mp4 /
        image URLs work without it. Auto-retry is{' '}
        {autoRetryEnabled ? 'on' : 'off'} in Settings.
      </Text>
    </Screen>
  );
}
