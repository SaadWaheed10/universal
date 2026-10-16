import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Play } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Pressable,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useScaledStyles, ri } from 'react-native-pixelflow';
import Video, { type OnVideoErrorData } from 'react-native-video';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { AppButton, Chip, Icon, Screen } from '../../components';
import { PLATFORM_LABELS, PLATFORM_PIP } from '../../constants/platforms';
import type { RootStackParamList } from '../../navigation/types';
import {
  removeDownloadItem,
  setDownloadCollections,
} from '../../store/downloadsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { colors } from '../../theme/colors';
import {
  getPlaybackUri,
  getPreviewImageUri,
  itemLooksLikeVideo,
  toFileUri,
} from '../../utils/media';
import { formatRelativeTime } from '../../utils/time';
import { createDownloadDetailScreenStyles } from './DownloadDetailScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'DownloadDetail'>;

export function DownloadDetailScreen({ navigation, route }: Props) {
  const styles = useScaledStyles(createDownloadDetailScreenStyles);
  const dispatch = useAppDispatch();
  const item = useAppSelector(state =>
    state.downloads.items.find(entry => entry.id === route.params.id),
  );
  const collections = useAppSelector(state => state.collections.items);
  const [imageFailed, setImageFailed] = useState(false);
  const [paused, setPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [fileReady, setFileReady] = useState(false);
  const [resolvedUri, setResolvedUri] = useState<string | undefined>();

  const preview = useMemo(
    () => (item ? getPreviewImageUri(item) : undefined),
    [item],
  );
  const playbackUri = useMemo(
    () => (item ? getPlaybackUri(item) : undefined),
    [item],
  );
  const isVideo = item
    ? itemLooksLikeVideo(item) && Boolean(playbackUri || item.localUri)
    : false;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!item || !isVideo) {
        setResolvedUri(undefined);
        setFileReady(false);
        return;
      }

      const candidates = [
        playbackUri,
        item.localUri ? toFileUri(item.localUri) : undefined,
        item.galleryUri ? toFileUri(item.galleryUri) : undefined,
      ].filter(Boolean) as string[];

      for (const candidate of candidates) {
        // Remote / ph / content — try directly.
        if (
          candidate.startsWith('ph://') ||
          candidate.startsWith('content://') ||
          /^https?:\/\//i.test(candidate)
        ) {
          if (!cancelled) {
            setResolvedUri(candidate);
            setFileReady(true);
          }
          return;
        }

        const path = candidate.replace(/^file:\/\//, '');
        try {
          const exists = await ReactNativeBlobUtil.fs.exists(path);
          if (exists) {
            if (!cancelled) {
              setResolvedUri(toFileUri(path));
              setFileReady(true);
            }
            return;
          }
        } catch {
          // try next
        }
      }

      if (!cancelled) {
        setResolvedUri(playbackUri);
        setFileReady(Boolean(playbackUri));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [item, isVideo, playbackUri]);

  if (!item) {
    return (
      <Screen>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Item not found</Text>
        <Text style={styles.meta}>
          It may have been removed from your library.
        </Text>
      </Screen>
    );
  }

  const toggleCollection = (collectionId: string) => {
    const has = item.collectionIds.includes(collectionId);
    const next = has
      ? item.collectionIds.filter(id => id !== collectionId)
      : [...item.collectionIds, collectionId];
    dispatch(setDownloadCollections({ id: item.id, collectionIds: next }));
  };

  const openOriginal = async () => {
    try {
      await Linking.openURL(item.cleanedUrl || item.url);
    } catch {
      Alert.alert('Could not open link');
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Remove from library?',
      'Removes this item from Universal. The file in Photos / Gallery stays on the device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await dispatch(removeDownloadItem(item.id));
            navigation.goBack();
          },
        },
      ],
    );
  };

  const startPlayback = () => {
    if (!resolvedUri) {
      Alert.alert(
        'No playable file',
        'Download this video again — the local file may be missing.',
      );
      return;
    }
    setHasStarted(true);
    setPaused(false);
  };

  const onVideoError = (e: OnVideoErrorData) => {
    const message =
      e?.error?.errorString ||
      e?.error?.localizedDescription ||
      e?.error?.code ||
      'Unknown playback error';
    setPaused(true);
    setHasStarted(false);
    Alert.alert('Playback failed', String(message));
  };

  return (
    <Screen scroll>
      <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
        <Text style={styles.back}>Back</Text>
      </Pressable>

      <View style={styles.preview}>
        {isVideo && fileReady && resolvedUri ? (
          <>
            <Video
              source={{ uri: resolvedUri }}
              style={styles.video}
              resizeMode="contain"
              controls={hasStarted}
              paused={paused}
              repeat
              playInBackground={false}
              ignoreSilentSwitch="ignore"
              onError={onVideoError}
              onLoad={() => {
                // Ready — keep paused until user taps play.
              }}
            />
            {paused || !hasStarted ? (
              <Pressable
                style={styles.playOverlay}
                onPress={startPlayback}
                accessibilityRole="button"
                accessibilityLabel="Play video">
                <View style={styles.playCircle}>
                  <Icon
                    icon={Play}
                    size={ri(28)}
                    color={colors.white}
                    strokeWidth={2.4}
                  />
                </View>
              </Pressable>
            ) : null}
          </>
        ) : preview && !imageFailed ? (
          <>
            <Image
              source={{ uri: preview }}
              style={styles.previewImage}
              resizeMode="cover"
              onError={() => setImageFailed(true)}
            />
            {isVideo ? (
              <Pressable style={styles.playOverlay} onPress={startPlayback}>
                <View style={styles.playCircle}>
                  <Icon
                    icon={Play}
                    size={ri(28)}
                    color={colors.white}
                    strokeWidth={2.4}
                  />
                </View>
              </Pressable>
            ) : null}
          </>
        ) : (
          <LinearGradient
            colors={[PLATFORM_PIP[item.platform], colors.surfaceElevated]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.previewFill}>
            {isVideo ? (
              <Pressable onPress={startPlayback} style={styles.playCircle}>
                <Icon
                  icon={Play}
                  size={ri(28)}
                  color={colors.white}
                  strokeWidth={2.4}
                />
              </Pressable>
            ) : (
              <Chip
                label={PLATFORM_LABELS[item.platform]}
                pipColor={PLATFORM_PIP[item.platform]}
              />
            )}
          </LinearGradient>
        )}
      </View>

      {isVideo ? (
        <Text style={styles.tapHint}>
          {hasStarted && !paused
            ? 'Use on-screen controls to scrub / pause'
            : 'Tap play to watch in-app'}
        </Text>
      ) : null}

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>
        {PLATFORM_LABELS[item.platform]} · {item.host} ·{' '}
        {formatRelativeTime(item.createdAt)}
        {item.savedToGallery ? ' · In gallery' : ''}
      </Text>

      <Text style={styles.sectionLabel}>Collections</Text>
      {collections.length === 0 ? (
        <Text style={styles.meta}>
          No collections yet. Create one on the Collections tab.
        </Text>
      ) : (
        <View style={styles.chipWrap}>
          {collections.map(collection => {
            const on = item.collectionIds.includes(collection.id);
            return (
              <Pressable
                key={collection.id}
                onPress={() => toggleCollection(collection.id)}
                style={[
                  styles.collectionChip,
                  on && styles.collectionChipOn,
                ]}>
                <Text
                  style={[
                    styles.collectionChipText,
                    on && styles.collectionChipTextOn,
                  ]}>
                  {collection.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <View style={styles.actions}>
        {isVideo ? (
          <AppButton
            label={hasStarted && !paused ? 'Pause' : 'Play video'}
            onPress={() => {
              if (!hasStarted || paused) {
                startPlayback();
              } else {
                setPaused(true);
              }
            }}
          />
        ) : null}
        <AppButton label="Open original link" onPress={openOriginal} />
        <AppButton
          label="Remove from library"
          variant="secondary"
          onPress={confirmDelete}
        />
      </View>

      <Text style={styles.note}>
        New downloads keep a local copy for playback. If an old item won’t play,
        download it again.
      </Text>
    </Screen>
  );
}
