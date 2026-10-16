import type { ReactNode } from 'react';
import { Platform, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScaledStyles, rp } from 'react-native-pixelflow';
import { AmbientBackground } from '../AmbientBackground';
import { createScreenStyles } from './Screen.styles';

type ScreenProps = {
  children: ReactNode;
  padded?: boolean;
  edges?: Array<'top' | 'bottom'>;
  /**
   * Keyboard-safe scroll for forms (Sign Up, Sign In, paste sheets, etc.).
   * Uses KeyboardAwareScrollView so iOS + Android stay scrollable
   * when the keyboard is open.
   */
  scroll?: boolean;
};

export function Screen({
  children,
  padded = true,
  edges = ['top'],
  scroll = false,
}: ScreenProps) {
  const styles = useScaledStyles(createScreenStyles);
  const insets = useSafeAreaInsets();

  const paddingTop = edges.includes('top') ? insets.top + rp(8) : 0;
  const paddingBottom = edges.includes('bottom')
    ? insets.bottom + rp(8)
    : scroll
      ? insets.bottom + rp(16)
      : 0;

  const contentStyle = [
    padded ? styles.content : styles.contentNoPad,
    { paddingTop, paddingBottom: scroll ? 0 : paddingBottom },
  ];

  const body = scroll ? (
    <KeyboardAwareScrollView
      style={styles.flex}
      contentContainerStyle={[styles.scrollContent, { paddingBottom }]}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={Platform.OS === 'ios' ? 30 : 130}
      showsVerticalScrollIndicator={false}
      enableAutomaticScroll
      keyboardOpeningTime={0}>
      {children}
    </KeyboardAwareScrollView>
  ) : (
    children
  );

  return (
    <View style={styles.root}>
      <AmbientBackground />
      <View style={contentStyle}>{body}</View>
    </View>
  );
}
