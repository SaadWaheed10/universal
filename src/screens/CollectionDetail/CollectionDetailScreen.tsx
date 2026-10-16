import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FolderOpen } from 'lucide-react-native';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useScaledStyles } from 'react-native-pixelflow';
import { EmptyState, Screen } from '../../components';
import { MediaGrid } from '../../components/MediaGrid';
import type { RootStackParamList } from '../../navigation/types';
import { deleteCollection } from '../../store/collectionsSlice';
import {
  detachCollectionFromDownloads,
  removeDownloadItem,
} from '../../store/downloadsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createCollectionDetailScreenStyles } from './CollectionDetailScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'CollectionDetail'>;

export function CollectionDetailScreen({ navigation, route }: Props) {
  const styles = useScaledStyles(createCollectionDetailScreenStyles);
  const dispatch = useAppDispatch();
  const collection = useAppSelector(state =>
    state.collections.items.find(entry => entry.id === route.params.id),
  );
  const items = useAppSelector(state =>
    state.downloads.items.filter(item =>
      item.collectionIds.includes(route.params.id),
    ),
  );

  const confirmDeleteCollection = () => {
    if (!collection) {
      return;
    }
    Alert.alert(
      'Delete collection?',
      `"${collection.title}" will be removed. Downloads stay in your library.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await dispatch(detachCollectionFromDownloads(collection.id));
            await dispatch(deleteCollection(collection.id));
            navigation.goBack();
          },
        },
      ],
    );
  };

  const confirmRemoveItem = (id: string, title: string) => {
    Alert.alert(
      'Remove from library?',
      `"${title}" will leave Universal. Gallery file stays.`,
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

  if (!collection) {
    return (
      <Screen>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Collection not found</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
        <Text style={styles.back}>Back</Text>
      </Pressable>

      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Collection</Text>
          <Text style={styles.title}>{collection.title}</Text>
          <Text style={styles.meta}>
            {items.length} {items.length === 1 ? 'download' : 'downloads'}
          </Text>
        </View>
        <Pressable onPress={confirmDeleteCollection} hitSlop={8}>
          <Text style={styles.delete}>Delete</Text>
        </Pressable>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            brand="Collection"
            title="Nothing here yet"
            subtitle="Open a download and tap this collection to add it."
            icon={FolderOpen}
          />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <MediaGrid
            items={items}
            onPressItem={item =>
              navigation.navigate('DownloadDetail', { id: item.id })
            }
            onLongPressItem={item => confirmRemoveItem(item.id, item.title)}
          />
        </ScrollView>
      )}
    </Screen>
  );
}
