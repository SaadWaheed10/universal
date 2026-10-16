import { flex, rf, rl, rp } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createCollectionDetailScreenStyles = () => ({
  back: {
    color: colors.accent,
    fontSize: rf(14),
    lineHeight: rl(20),
    fontWeight: '600' as const,
    marginBottom: rp(16),
  },
  header: {
    ...flex.between,
    alignItems: 'flex-start' as const,
    marginBottom: rp(16),
    gap: rp(12),
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    color: colors.accentSecondary,
    fontSize: rf(12),
    lineHeight: rl(16),
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    marginBottom: rp(6),
  },
  title: {
    color: colors.textPrimary,
    fontSize: rf(26),
    lineHeight: rl(32),
    fontWeight: '700' as const,
  },
  meta: {
    color: colors.textMuted,
    fontSize: rf(13),
    lineHeight: rl(18),
    marginTop: rp(4),
  },
  delete: {
    color: colors.danger,
    fontSize: rf(13),
    lineHeight: rl(18),
    fontWeight: '600' as const,
    marginTop: rp(6),
  },
  emptyWrap: {
    flex: 1,
  },
});
