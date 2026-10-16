import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Download } from 'lucide-react-native';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useScaledStyles, ri } from 'react-native-pixelflow';
import { AppButton, Icon, Screen } from '../../components';
import type { RootStackParamList } from '../../navigation/types';
import {
  setHasOnboarded,
  setIsGuest,
} from '../../services/onboardingStorage';
import { colors } from '../../theme/colors';
import { createWelcomeScreenStyles } from './WelcomeScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  const styles = useScaledStyles(createWelcomeScreenStyles);

  const enterApp = async (guest: boolean) => {
    await setIsGuest(guest);
    await setHasOnboarded(true);
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <Screen>
      <View style={styles.root}>
        <View style={styles.markWrap}>
          <LinearGradient
            colors={[colors.accent, colors.accentSecondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.markGradient}
          />
          <Icon
            icon={Download}
            size={ri(28)}
            color={colors.bg}
            strokeWidth={2.2}
          />
        </View>

        <Text style={styles.brand}>Universal</Text>
        <Text style={styles.title}>Paste. Download. Keep.</Text>
        <Text style={styles.body}>
          Create an account for an in-app grid of everything you save — or
          continue as a guest and send files straight to Photos / Gallery.
        </Text>

        <View style={styles.actions}>
          <AppButton
            label="Create account"
            onPress={() => navigation.navigate('SignUp')}
          />
          <AppButton
            label="Sign in"
            variant="secondary"
            onPress={() => navigation.navigate('SignIn')}
          />
          <AppButton
            label="Continue without an account"
            variant="ghost"
            onPress={() => enterApp(true)}
          />
        </View>
      </View>
    </Screen>
  );
}
