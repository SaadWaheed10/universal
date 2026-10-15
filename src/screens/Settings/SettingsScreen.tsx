import type { LucideIcon } from 'lucide-react-native';
import {
  ClipboardCopy,
  Download,
  ShieldCheck,
  Trash2,
} from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useScaledStyles, ri } from 'react-native-pixelflow';
import { AppText, Icon, Screen } from '../../components';
import { colors } from '../../theme/colors';
import { createSettingsScreenStyles } from './SettingsScreen.styles';

const ROWS: Array<{
  label: string;
  value: string;
  icon: LucideIcon;
}> = [
  { label: 'Clipboard watch', value: 'Coming soon', icon: ClipboardCopy },
  { label: 'Privacy', value: 'Local only', icon: ShieldCheck },
  { label: 'Export', value: 'Coming soon', icon: Download },
  { label: 'Clear data', value: '—', icon: Trash2 },
];

export function SettingsScreen() {
  const styles = useScaledStyles(createSettingsScreenStyles);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Preferences</Text>
        <AppText variant="title">Settings</AppText>
      </View>

      <View style={styles.group}>
        {ROWS.map((row, index) => (
          <View
            key={row.label}
            style={[styles.row, index === ROWS.length - 1 && styles.rowLast]}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <Icon
                  icon={row.icon}
                  size={ri(16)}
                  color={colors.accent}
                  strokeWidth={2}
                />
              </View>
              <Text style={styles.rowLabel}>{row.label}</Text>
            </View>
            <Text style={styles.rowValue}>{row.value}</Text>
          </View>
        ))}
      </View>

      <AppText variant="caption" style={styles.footer}>
        Universal stays on-device for now. Sync lands later when we grow.
      </AppText>
    </Screen>
  );
}
