import { Pressable, Text, View } from 'react-native';
import { useScaledStyles } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';
import { createChipStyles } from './Chip.styles';

type ChipProps = {
  label: string;
  pipColor?: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, pipColor, selected, onPress }: ChipProps) {
  const styles = useScaledStyles(createChipStyles);
  const content = (
    <>
      {pipColor ? (
        <View style={[styles.pip, { backgroundColor: pipColor }]} />
      ) : null}
      <Text
        style={[
          styles.label,
          selected ? { color: colors.accent } : null,
        ]}>
        {label}
      </Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.root, selected ? styles.rootSelected : null]}>
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.root, selected ? styles.rootSelected : null]}>
      {content}
    </View>
  );
}
