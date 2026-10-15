import { Pressable, Text, View } from 'react-native';
import { useScaledStyles } from 'react-native-pixelflow';
import { PLATFORM_LABELS, PLATFORM_PIP } from '../../constants/platforms';
import type { SavedLink } from '../../types';
import { formatRelativeTime } from '../../utils/time';
import { Chip } from '../Chip';
import { createLinkCardStyles } from './LinkCard.styles';

type LinkCardProps = {
  link: SavedLink;
  onPress?: () => void;
};

export function LinkCard({ link, onPress }: LinkCardProps) {
  const styles = useScaledStyles(createLinkCardStyles);

  return (
    <Pressable onPress={onPress} style={styles.root}>
      <View style={styles.topRow}>
        <Chip
          label={PLATFORM_LABELS[link.platform]}
          pipColor={PLATFORM_PIP[link.platform]}
        />
        <Text style={styles.time}>{formatRelativeTime(link.createdAt)}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {link.title}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.host} numberOfLines={1}>
          {link.host}
        </Text>
      </View>
    </Pressable>
  );
}
