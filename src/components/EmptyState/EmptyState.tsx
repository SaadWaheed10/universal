import type { LucideIcon } from 'lucide-react-native';
import { Link2 } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useScaledStyles, ri } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';
import { AppButton } from '../AppButton';
import { AppText } from '../AppText';
import { Icon } from '../Icon';
import { createEmptyStateStyles } from './EmptyState.styles';

type EmptyStateProps = {
  brand?: string;
  title: string;
  subtitle: string;
  icon?: LucideIcon;
  primaryLabel?: string;
  onPrimaryPress?: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
};

export function EmptyState({
  brand = 'Universal',
  title,
  subtitle,
  icon = Link2,
  primaryLabel,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
}: EmptyStateProps) {
  const styles = useScaledStyles(createEmptyStateStyles);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 420,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.root,
        { opacity, transform: [{ translateY }] },
      ]}>
      <View style={styles.glow}>
        <LinearGradient
          colors={[colors.accent, colors.accentSecondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glowInner}
        />
        <Icon icon={icon} size={ri(28)} color={colors.bg} strokeWidth={2.2} />
      </View>

      <AppText variant="brand" align="center" style={styles.brand}>
        {brand}
      </AppText>
      <AppText variant="title" align="center">
        {title}
      </AppText>
      <AppText variant="subtitle" align="center" style={styles.copy}>
        {subtitle}
      </AppText>

      {(primaryLabel || secondaryLabel) && (
        <View style={styles.actions}>
          {primaryLabel ? (
            <AppButton label={primaryLabel} onPress={onPrimaryPress} />
          ) : null}
          {secondaryLabel ? (
            <AppButton
              label={secondaryLabel}
              variant="secondary"
              onPress={onSecondaryPress}
            />
          ) : null}
        </View>
      )}
    </Animated.View>
  );
}
