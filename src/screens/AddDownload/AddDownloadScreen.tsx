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
import { useAppDispatch } from '../../store/hooks';
import { colors } from '../../theme/colors';
import { detectPlatform } from '../../utils/platformDetect';
import { isValidHttpUrl } from '../../utils/url';
import { createAddDownloadScreenStyles } from './AddDownloadScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AddDownload'>;

export function AddDownloadScreen({ navigation }: Props) {
  const styles = useScaledStyles(createAddDownloadScreenStyles);
  const dispatch = useAppDispatch();
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);

  const platform = useMemo(
    () => (url.trim() ? detectPlatform(url) : null),
    [url],
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const clip = await Clipboard.getString();
        if (
          mounted &&
          !url &&
          clip &&
          isValidHttpUrl(clip) &&
          /instagram|tiktok|youtube|youtu\.be|twitter|x\.com|facebook|reddit|threads|linkedin|\.(mp4|mov|jpg|png|webp)/i.test(
            clip,
          )
        ) {
          setUrl(clip.trim());
        }
      } catch {
        // Clipboard may be empty / denied — ignore.
      }
    })();
    return () => {
      mounted = false;
    };
    // Prefill once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pasteFromClipboard = async () => {
    try {
      const clip = await Clipboard.getString();
      if (!clip?.trim()) {
        Alert.alert('Clipboard empty', 'Copy a link first, then paste here.');
        return;
      }
      setUrl(clip.trim());
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
              style={[styles.fill, { width: `${Math.round(progress.ratio * 100)}%` }]}
            />
          </View>
        </View>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <View style={styles.actions}>
        <AppButton
          label={busy ? 'Working…' : 'Download & save'}
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
        image URLs work without it. We never fetch blocked social CDN links.
      </Text>
    </Screen>
  );
}
