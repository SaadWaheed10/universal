import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useScaledStyles } from 'react-native-pixelflow';
import { AppButton, Screen } from '../../components';
import type { RootStackParamList } from '../../navigation/types';
import {
  setHasOnboarded,
  setIsGuest,
} from '../../services/onboardingStorage';
import { colors } from '../../theme/colors';
import { createAuthScreenStyles } from './AuthScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const styles = useScaledStyles(createAuthScreenStyles);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const finish = async () => {
    await setIsGuest(false);
    await setHasOnboarded(true);
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <Screen scroll>
      <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
        <Text style={styles.back}>Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>
          Unlock your in-app download grid. Full auth and sync land later —
          this is a local shell for now.
        </Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCapitalize="words"
          returnKeyType="next"
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={finish}
        />
      </View>

      <View style={styles.footer}>
        <AppButton label="Continue" onPress={finish} />
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Already have an account? </Text>
          <Pressable onPress={() => navigation.replace('SignIn')} hitSlop={8}>
            <Text style={styles.switchLink}>Sign in</Text>
          </Pressable>
        </View>
        <Text style={styles.note}>
          Nothing is sent to a server yet. This is a local welcome shell.
        </Text>
      </View>
    </Screen>
  );
}
