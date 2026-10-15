import { flex, rf, rl, rp, rr } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createLinkCardStyles = () => ({
  root: {
    backgroundColor: colors.surface,
    borderRadius: rr(16),
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: rp(14),
    gap: rp(10),
  },
  topRow: {
    ...flex.between,
    alignItems: 'center' as const,
  },
  title: {
    color: colors.textPrimary,
    fontSize: rf(15),
    lineHeight: rl(21),
    fontWeight: '600' as const,
  },
  metaRow: {
    ...flex.between,
    alignItems: 'center' as const,
  },
  host: {
    color: colors.textMuted,
    fontSize: rf(12),
    lineHeight: rl(16),
    fontWeight: '500' as const,
    flexShrink: 1,
  },
  time: {
    color: colors.textMuted,
    fontSize: rf(12),
    lineHeight: rl(16),
    fontWeight: '500' as const,
  },
});
