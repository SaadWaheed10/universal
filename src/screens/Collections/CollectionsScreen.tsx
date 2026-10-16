import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FolderPlus, Lock } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useScaledStyles } from 'react-native-pixelflow';
import { AppButton, AppText, EmptyState, Screen } from '../../components';
import { useAccountMode } from '../../hooks';
import type { RootStackParamList } from '../../navigation/types';
import { createCollection } from '../../store/collectionsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { colors } from '../../theme/colors';
import { createCollectionsScreenStyles } from './CollectionsScreen.styles';

export function CollectionsScreen() {
  const styles = useScaledStyles(createCollectionsScreenStyles);
  const { ready, isGuest, hasLibrary } = useAccountMode();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const collections = useAppSelector(state => state.collections.items);
  const downloads = useAppSelector(state => state.downloads.items);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const collection of collections) {
      map[collection.id] = 0;
    }
    for (const item of downloads) {
      for (const id of item.collectionIds) {
        map[id] = (map[id] ?? 0) + 1;
      }
    }
    return map;
  }, [collections, downloads]);

  const openSignUp = () => {
    const root =
      navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    root?.navigate('SignUp');
  };

  const openCollection = (id: string) => {
    const root =
      navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    root?.navigate('CollectionDetail', { id });
  };

  const onCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Enter a collection name.');
      return;
    }
    setCreating(true);
    try {
      await dispatch(createCollection(name)).unwrap();
      setName('');
    } catch (e) {
      Alert.alert(
        'Could not create',
        e instanceof Error ? e.message : 'Try again.',
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Library</Text>
          <AppText variant="title">Collections</AppText>
        </View>
      </View>

      {!ready ? null : isGuest || !hasLibrary ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            brand="Collections"
            title="Library is for accounts"
            subtitle="Guests save to Photos / Gallery only. Create an account to group downloads into collections and keep an in-app archive."
            icon={Lock}
            primaryLabel="Create account"
            onPrimaryPress={openSignUp}
          />
        </View>
      ) : (
        <>
          <View style={styles.createRow}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="New collection name"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={onCreate}
            />
            <AppButton
              label={creating ? '…' : 'Add'}
              onPress={onCreate}
              disabled={creating}
            />
          </View>

          {collections.length === 0 ? (
            <View style={styles.emptyWrap}>
              <EmptyState
                brand="Collections"
                title="Group what you keep"
                subtitle="Create boards for later, ideas, or work — then assign downloads from an item’s detail screen."
                icon={FolderPlus}
              />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.grid}>
                {collections.map(item => (
                  <Pressable
                    key={item.id}
                    onPress={() => openCollection(item.id)}
                    style={styles.card}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardMeta}>
                      {counts[item.id] ?? 0}{' '}
                      {(counts[item.id] ?? 0) === 1 ? 'download' : 'downloads'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          )}
        </>
      )}
    </Screen>
  );
}
