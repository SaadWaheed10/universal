import { Pressable, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useScaledStyles } from 'react-native-pixelflow';
import { PLATFORM_LABELS, PLATFORM_PIP } from '../../constants/platforms';
import type { DownloadItem } from '../../types';
import { colors } from '../../theme/colors';
import { createMediaGridStyles } from './MediaGrid.styles';

type MediaGridProps = {
  items: DownloadItem[];
  onPressItem?: (item: DownloadItem) => void;
};

/** Instagram-style square grid for registered library. */
export function MediaGrid({ items, onPressItem }: MediaGridProps) {
  const styles = useScaledStyles(createMediaGridStyles);

  return (
    <View style={styles.grid}>
      {items.map(item => {
        const pip = PLATFORM_PIP[item.platform];
        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={item.title}
            onPress={() => onPressItem?.(item)}
            style={styles.tile}>
            <LinearGradient
              colors={[pip, colors.surfaceElevated]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tileFill}>
              <Text style={styles.tileLabel} numberOfLines={3}>
                {item.title}
              </Text>
              <Text style={styles.tileMeta}>
                {PLATFORM_LABELS[item.platform]}
              </Text>
            </LinearGradient>
          </Pressable>
        );
      })}
    </View>
  );
}
