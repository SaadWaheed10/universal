import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FolderPlus, Lock } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useScaledStyles } from 'react-native-pixelflow';
import { AppText, EmptyState, Screen } from '../../components';
import { useAccountMode } from '../../hooks';
import type { RootStackParamList } from '../../navigation/types';
import { createCollectionsScreenStyles } from './CollectionsScreen.styles';

const PLACEHOLDER_COLLECTIONS = [
  { id: 'later', title: 'Watch later', count: 0 },
  { id: 'ideas', title: 'Ideas', count: 0 },
  { id: 'work', title: 'Work', count: 0 },
];

export function CollectionsScreen() {
  const styles = useScaledStyles(createCollectionsScreenStyles);
  const { ready, isGuest, hasLibrary } = useAccountMode();
  const navigation = useNavigation();
  const hasCollections = false;

  const openSignUp = () => {
    const root =
      navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    root?.navigate('SignUp');
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Library</Text>
        <AppText variant="title">Collections</AppText>
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
      ) : hasCollections ? (
        <View style={styles.grid}>
          {PLACEHOLDER_COLLECTIONS.map(item => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>{item.count} downloads</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyWrap}>
          <EmptyState
            brand="Collections"
            title="Group what you keep"
            subtitle="Boards for later, ideas, or work — assign downloads as you save them to your gallery."
            icon={FolderPlus}
            primaryLabel="New collection"
          />
        </View>
      )}
    </Screen>
  );
}
