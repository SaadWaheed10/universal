import { Text, View } from 'react-native';
import { useScaledStyles } from 'react-native-pixelflow';
import { createChipStyles } from './Chip.styles';

type ChipProps = {
  label: string;
  pipColor?: string;
};

export function Chip({ label, pipColor }: ChipProps) {
  const styles = useScaledStyles(createChipStyles);

  return (
    <View style={styles.root}>
      {pipColor ? <View style={[styles.pip, { backgroundColor: pipColor }]} /> : null}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
