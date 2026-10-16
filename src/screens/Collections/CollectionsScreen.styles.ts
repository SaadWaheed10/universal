import { flex, rf, rl, rh, rp, rr, rw } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createCollectionsScreenStyles = () => ({
  header: {
    ...flex.between,
    alignItems: 'flex-end' as const,
    marginBottom: rp(18),
  },
  headerCopy: {
    flex: 1,
    paddingRight: rp(12),
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
  createRow: {
    ...flex.row,
    gap: rp(10),
    marginBottom: rp(16),
    alignItems: 'center' as const,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: rr(14),
    paddingHorizontal: rp(14),
    paddingVertical: rp(12),
    color: colors.textPrimary,
    fontSize: rf(14),
    lineHeight: rl(20),
  },
  grid: {
    ...flex.row,
    flexWrap: 'wrap' as const,
    gap: rp(12),
    paddingBottom: rp(28),
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
