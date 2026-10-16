import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Download, Plus } from 'lucide-react-native';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useScaledStyles, ri } from 'react-native-pixelflow';
import {
  AppText,
  EmptyState,
  Icon,
  MediaGrid,
  Screen,
} from '../../components';
import { useAccountMode } from '../../hooks';
import type { RootStackParamList } from '../../navigation/types';
import { removeDownloadItem } from '../../store/downloadsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { colors } from '../../theme/colors';
import { createDownloadsScreenStyles } from './DownloadsScreen.styles';

export function DownloadsScreen() {
  const styles = useScaledStyles(createDownloadsScreenStyles);
  const { ready, isGuest, hasLibrary } = useAccountMode();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const items = useAppSelector(state => state.downloads.items);

  const rootNav = () =>
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  const openAddDownload = () => {
    rootNav()?.navigate('AddDownload');
  };

  const openSignUp = () => {
    rootNav()?.navigate('SignUp');
  };

  const openDetail = (id: string) => {
    rootNav()?.navigate('DownloadDetail', { id });
  };

  const confirmRemove = (id: string, title: string) => {
    Alert.alert(
      'Remove from library?',
      `"${title}" will leave Universal. The file in Photos / Gallery stays.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            dispatch(removeDownloadItem(id));
          },
        },
      ],
    );
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
                : 'Account · tap a tile · long-press to remove'}
            </Text>
          ) : null}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add download"
          onPress={openAddDownload}
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
            onPrimaryPress={openAddDownload}
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
            onPrimaryPress={openAddDownload}
          />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.guestNote}>
            {items.length} saved · also in Photos / Gallery
          </Text>
          <MediaGrid
            items={items}
            onPressItem={item => openDetail(item.id)}
            onLongPressItem={item => confirmRemove(item.id, item.title)}
          />
        </ScrollView>
      )}
    </Screen>
  );
}
