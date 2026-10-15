import { flex, rf, rl, rh, rp, rr, rw } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createCollectionsScreenStyles = () => ({
  header: {
    marginBottom: rp(18),
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
  grid: {
    ...flex.row,
    flexWrap: 'wrap' as const,
    gap: rp(12),
  },
  card: {
    width: rw(43.5),
    minHeight: rh(16),
    backgroundColor: colors.surface,
    borderRadius: rr(18),
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: rp(16),
    justifyContent: 'space-between' as const,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: rf(16),
    lineHeight: rl(22),
    fontWeight: '600' as const,
    marginBottom: rp(8),
  },
  cardMeta: {
    color: colors.textMuted,
    fontSize: rf(12),
    lineHeight: rl(16),
    fontWeight: '500' as const,
  },
  emptyWrap: {
    flex: 1,
  },
});
