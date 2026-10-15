import { useRef } from 'react';
import {
  Animated,
  Pressable,
  Text,
  type PressableProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useScaledStyles } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';
import { createAppButtonStyles } from './AppButton.styles';

type AppButtonVariant = 'primary' | 'secondary' | 'ghost';

type AppButtonProps = PressableProps & {
  label: string;
  variant?: AppButtonVariant;
};

export function AppButton({
  label,
  variant = 'primary',
  onPressIn,
  onPressOut,
  style,
  ...rest
}: AppButtonProps) {
  const styles = useScaledStyles(createAppButtonStyles);
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        {...rest}
        onPressIn={e => {
          Animated.spring(scale, {
            toValue: 0.97,
            useNativeDriver: true,
            friction: 6,
            tension: 160,
          }).start();
          onPressIn?.(e);
        }}
        onPressOut={e => {
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            friction: 5,
            tension: 120,
          }).start();
          onPressOut?.(e);
        }}
        style={[
          styles.base,
          variant === 'primary' && styles.primary,
          variant === 'secondary' && styles.secondary,
          variant === 'ghost' && styles.ghost,
          style,
        ]}>
        {variant === 'primary' ? (
          <LinearGradient
            colors={[colors.accent, colors.accentSecondary]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientFill}
          />
        ) : null}
        <Text
          style={[
            variant === 'primary' && styles.label,
            variant === 'secondary' && styles.labelSecondary,
            variant === 'ghost' && styles.labelGhost,
          ]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
