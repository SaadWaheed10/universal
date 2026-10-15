import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useScaledStyles, ri, rp } from 'react-native-pixelflow';
import { AppButton, Icon, Screen } from '../../components';
import { ONBOARDING_SLIDES } from '../../constants/onboarding';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { createOnboardingScreenStyles } from './OnboardingScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props) {
  const styles = useScaledStyles(createOnboardingScreenStyles);
  const { width } = useWindowDimensions();
  const pageWidth = width - rp(40);
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const isLast = index === ONBOARDING_SLIDES.length - 1;

  const goWelcome = () => {
    navigation.replace('Welcome');
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
    setIndex(Math.max(0, Math.min(next, ONBOARDING_SLIDES.length - 1)));
  };

  const goNext = () => {
    if (isLast) {
      goWelcome();
      return;
    }
    const next = index + 1;
    scrollRef.current?.scrollTo({ x: next * pageWidth, animated: true });
    setIndex(next);
  };

  return (
    <Screen>
      <View style={styles.root}>
        <View style={styles.topBar}>
          <View />
          <Pressable onPress={goWelcome} hitSlop={12}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          style={styles.pager}
          contentContainerStyle={{ alignItems: 'stretch' }}>
          {ONBOARDING_SLIDES.map(slide => (
            <View key={slide.id} style={[styles.page, { width: pageWidth }]}>
              <View style={styles.markWrap}>
                <LinearGradient
                  colors={[colors.accent, colors.accentSecondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.markGradient}
                />
                <Icon
                  icon={slide.icon}
                  size={ri(30)}
                  color={colors.bg}
                  strokeWidth={2.2}
                />
              </View>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.body}>{slide.body}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {ONBOARDING_SLIDES.map((slide, i) => (
              <View
                key={slide.id}
                style={[styles.dot, i === index && styles.dotActive]}
              />
            ))}
          </View>
          <AppButton
            label={isLast ? 'Get started' : 'Next'}
            onPress={goNext}
          />
        </View>
      </View>
    </Screen>
  );
}
