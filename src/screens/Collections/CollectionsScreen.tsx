import { FolderPlus } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useScaledStyles } from 'react-native-pixelflow';
import { AppText, EmptyState, Screen } from '../../components';
import { createCollectionsScreenStyles } from './CollectionsScreen.styles';

const PLACEHOLDER_COLLECTIONS = [
  { id: 'later', title: 'Watch later', count: 0 },
  { id: 'ideas', title: 'Ideas', count: 0 },
  { id: 'work', title: 'Work', count: 0 },
];

export function CollectionsScreen() {
  const styles = useScaledStyles(createCollectionsScreenStyles);
  const hasCollections = false;

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Library</Text>
        <AppText variant="title">Collections</AppText>
      </View>

      {hasCollections ? (
        <View style={styles.grid}>
          {PLACEHOLDER_COLLECTIONS.map(item => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>{item.count} links</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyWrap}>
          <EmptyState
            brand="Collections"
            title="Group what matters"
            subtitle="Create boards for work, ideas, recipes, or later — assign links as you save."
            icon={FolderPlus}
            primaryLabel="New collection"
          />
        </View>
      )}
    </Screen>
  );
}
