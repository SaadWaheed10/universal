import { Play } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useScaledStyles, ri } from 'react-native-pixelflow';
import { PLATFORM_PIP } from '../../constants/platforms';
import type { DownloadItem } from '../../types';
import { colors } from '../../theme/colors';
import {
  getPreviewImageUri,
  itemLooksLikeVideo,
} from '../../utils/media';
import { Icon } from '../Icon';
import { createMediaGridStyles } from './MediaGrid.styles';

type MediaGridProps = {
  items: DownloadItem[];
  onPressItem?: (item: DownloadItem) => void;
  onLongPressItem?: (item: DownloadItem) => void;
};

/** Instagram-style square grid for registered library. */
export function MediaGrid({
  items,
  onPressItem,
  onLongPressItem,
}: MediaGridProps) {
  const styles = useScaledStyles(createMediaGridStyles);

  return (
    <View style={styles.grid}>
      {items.map(item => (
        <MediaTile
          key={item.id}
          item={item}
          styles={styles}
          onPress={() => onPressItem?.(item)}
          onLongPress={() => onLongPressItem?.(item)}
        />
      ))}
    </View>
  );
}

function MediaTile({
  item,
  styles,
  onPress,
  onLongPress,
}: {
  item: DownloadItem;
  styles: ReturnType<typeof createMediaGridStyles>;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const uri = useMemo(() => getPreviewImageUri(item), [item]);
  const [imageFailed, setImageFailed] = useState(false);
  const pip = PLATFORM_PIP[item.platform];
  const showImage = Boolean(uri) && !imageFailed;
  const showPlay = itemLooksLikeVideo(item);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.title}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={350}
      style={styles.tile}>
      {showImage ? (
        <Image
          source={{ uri }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <LinearGradient
          colors={[pip, colors.surfaceElevated]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tileFill}
        />
      )}

      {showPlay ? (
        <View style={styles.playBadge}>
          <Icon icon={Play} size={ri(12)} color={colors.white} strokeWidth={2.4} />
        </View>
      ) : null}

      <View style={styles.overlay}>
        <Text style={styles.tileLabel} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </Pressable>
  );
}
