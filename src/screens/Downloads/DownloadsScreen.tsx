import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Download, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useScaledStyles, ri } from 'react-native-pixelflow';
import {
  AppText,
  EmptyState,
  Icon,
  MediaGrid,
  Screen,
} from '../../components';
import { MOCK_DOWNLOADS } from '../../data/mockDownloads';
import { useAccountMode } from '../../hooks';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { createDownloadsScreenStyles } from './DownloadsScreen.styles';

export function DownloadsScreen() {
  const styles = useScaledStyles(createDownloadsScreenStyles);
  const { ready, isGuest, hasLibrary } = useAccountMode();
  const navigation = useNavigation();
  const [showMocks, setShowMocks] = useState(true);
  const items = showMocks && hasLibrary ? MOCK_DOWNLOADS : [];

  const openSignUp = () => {
    const root =
      navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    root?.navigate('SignUp');
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Downloads</Text>
          <AppText variant="title">
            {hasLibrary ? 'Your library' : 'Save to gallery'}
          </AppText>
          {ready ? (
            <Text style={styles.modeBadge}>
              {isGuest
                ? 'Guest · files go to Photos / Gallery only'
                : 'Account · in-app grid archive'}
            </Text>
          ) : null}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add download"
          onPress={() => {
            if (hasLibrary) {
              setShowMocks(prev => !prev);
            }
          }}
          style={styles.addButton}>
          <LinearGradient
            colors={[colors.accent, colors.accentSecondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addGradient}
          />
          <Icon icon={Plus} size={ri(22)} color={colors.bg} strokeWidth={2.4} />
        </Pressable>
      </View>

      {!ready ? null : isGuest ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            brand="Universal"
            title="Paste a link, save to gallery"
            subtitle="As a guest, downloads go straight to Photos (iOS) or Gallery (Android). Create an account to keep an Instagram-style grid inside the app."
            icon={Download}
            primaryLabel="Paste a link"
            secondaryLabel="Create account for library"
            onSecondaryPress={openSignUp}
          />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            brand="Library"
            title="Your grid starts here"
            subtitle="Paste a social link — we download it, save it to your gallery, and keep it in this archive."
            icon={Download}
            primaryLabel="Paste a link"
            secondaryLabel="Show demo grid"
            onSecondaryPress={() => setShowMocks(true)}
          />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.guestNote}>
            Demo grid · real downloads land in Phase 2 (iOS + Android).
          </Text>
          <MediaGrid items={items} />
        </ScrollView>
      )}
    </Screen>
  );
}
