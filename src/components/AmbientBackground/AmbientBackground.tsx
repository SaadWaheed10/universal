import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  AppState,
  Easing,
  type AppStateStatus,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useScaledStyles } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';
import { createAmbientBackgroundStyles } from './AmbientBackground.styles';

/**
 * Lightweight ambient wash: two soft orbs + slow opacity/translate.
 * Uses RN Animated (no Reanimated) for reliable Android startup.
 */
export function AmbientBackground() {
  const styles = useScaledStyles(createAmbientBackgroundStyles);
  const mintOpacity = useRef(new Animated.Value(0.55)).current;
  const mintY = useRef(new Animated.Value(0)).current;
  const azureOpacity = useRef(new Animated.Value(0.45)).current;
  const azureY = useRef(new Animated.Value(0)).current;
  const loopsRef = useRef<Animated.CompositeAnimation[]>([]);
  const [active, setActive] = useState(AppState.currentState === 'active');

  useEffect(() => {
    const onChange = (next: AppStateStatus) => {
      setActive(next === 'active');
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    loopsRef.current.forEach(loop => loop.stop());
    loopsRef.current = [];

    if (!active) {
      return;
    }

    const mintOpacityLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(mintOpacity, {
          toValue: 1,
          duration: 12000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(mintOpacity, {
          toValue: 0.55,
          duration: 12000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    const mintYLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(mintY, {
          toValue: 18,
          duration: 14000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(mintY, {
          toValue: 0,
          duration: 14000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const azureOpacityLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(azureOpacity, {
          toValue: 0.9,
          duration: 11000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(azureOpacity, {
          toValue: 0.45,
          duration: 11000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    const azureYLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(azureY, {
          toValue: -16,
          duration: 13000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(azureY, {
          toValue: 0,
          duration: 13000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    loopsRef.current = [
      mintOpacityLoop,
      mintYLoop,
      azureOpacityLoop,
      azureYLoop,
    ];
    loopsRef.current.forEach(loop => loop.start());

    return () => {
      loopsRef.current.forEach(loop => loop.stop());
      loopsRef.current = [];
    };
  }, [active, azureOpacity, azureY, mintOpacity, mintY]);

  return (
    <View pointerEvents="none" style={styles.root}>
      <LinearGradient
        colors={[colors.bgLifted, colors.bg, colors.bg]}
        locations={[0, 0.45, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.wash}
      />
      <Animated.View
        style={[
          styles.orbMint,
          { opacity: mintOpacity, transform: [{ translateY: mintY }] },
        ]}
      />
      <Animated.View
        style={[
          styles.orbAzure,
          { opacity: azureOpacity, transform: [{ translateY: azureY }] },
        ]}
      />
    </View>
  );
}
