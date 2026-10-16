import { Pressable, Text, View } from 'react-native';
import { useScaledStyles } from 'react-native-pixelflow';
import { PLATFORM_LABELS, PLATFORM_PIP } from '../../constants/platforms';
import type { DownloadItem } from '../../types';
import { formatRelativeTime } from '../../utils/time';
import { Chip } from '../Chip';
import { createLinkCardStyles } from './LinkCard.styles';

type LinkCardProps = {
  item: DownloadItem;
  onPress?: () => void;
};

export function LinkCard({ item, onPress }: LinkCardProps) {
  const styles = useScaledStyles(createLinkCardStyles);

  return (
    <Pressable onPress={onPress} style={styles.root}>
      <View style={styles.topRow}>
        <Chip
          label={PLATFORM_LABELS[item.platform]}
          pipColor={PLATFORM_PIP[item.platform]}
        />
        <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.host} numberOfLines={1}>
          {item.savedToGallery ? 'Saved to gallery · ' : ''}
          {item.host}
        </Text>
      </View>
    </Pressable>
  );
}
