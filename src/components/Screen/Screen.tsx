import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScaledStyles, rp } from 'react-native-pixelflow';
import { AmbientBackground } from '../AmbientBackground';
import { createScreenStyles } from './Screen.styles';

type ScreenProps = {
  children: ReactNode;
  padded?: boolean;
  edges?: Array<'top' | 'bottom'>;
};

export function Screen({
  children,
  padded = true,
  edges = ['top'],
}: ScreenProps) {
  const styles = useScaledStyles(createScreenStyles);
  const insets = useSafeAreaInsets();

  const paddingTop = edges.includes('top') ? insets.top + rp(8) : 0;
  const paddingBottom = edges.includes('bottom') ? insets.bottom + rp(8) : 0;

  return (
    <View style={styles.root}>
      <AmbientBackground />
      <View
        style={[
          padded ? styles.content : styles.contentNoPad,
          { paddingTop, paddingBottom },
        ]}>
        {children}
      </View>
    </View>
  );
}
