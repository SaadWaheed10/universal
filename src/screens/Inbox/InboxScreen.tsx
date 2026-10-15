import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useScaledStyles, ri } from 'react-native-pixelflow';
import { AppText, EmptyState, Icon, LinkCard, Screen } from '../../components';
import { MOCK_LINKS } from '../../data/mockLinks';
import { colors } from '../../theme/colors';
import { createInboxScreenStyles } from './InboxScreen.styles';

export function InboxScreen() {
  const styles = useScaledStyles(createInboxScreenStyles);
  const [showMocks, setShowMocks] = useState(true);
  const links = showMocks ? MOCK_LINKS : [];

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Inbox</Text>
          <AppText variant="title">Saved links</AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add link"
          onPress={() => setShowMocks(prev => !prev)}
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

      {links.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            title="Drop any social link"
            subtitle="Copy from Instagram, TikTok, X, YouTube and more — we clean it, preview it, and keep it ready."
            primaryLabel="Paste a link"
            secondaryLabel="Show demo links"
            onSecondaryPress={() => setShowMocks(true)}
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}>
          {links.map(link => (
            <LinkCard key={link.id} link={link} />
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}
