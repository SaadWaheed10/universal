import { flex, rf, rl, rp, rr } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createAddDownloadScreenStyles = () => ({
  back: {
    color: colors.accent,
    fontSize: rf(14),
    lineHeight: rl(20),
    fontWeight: '600' as const,
    marginBottom: rp(18),
  },
  header: {
    marginBottom: rp(22),
  },
  title: {
    color: colors.textPrimary,
    fontSize: rf(28),
    lineHeight: rl(34),
    fontWeight: '700' as const,
    marginBottom: rp(8),
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: rf(15),
    lineHeight: rl(22),
    fontWeight: '400' as const,
  },
  field: {
    marginBottom: rp(14),
  },
  label: {
    color: colors.textMuted,
    fontSize: rf(12),
    lineHeight: rl(16),
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
    marginBottom: rp(8),
  },
  input: {
    minHeight: rp(110),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: rr(14),
    paddingHorizontal: rp(16),
    paddingVertical: rp(14),
    color: colors.textPrimary,
    fontSize: rf(15),
    lineHeight: rl(22),
    textAlignVertical: 'top' as const,
  },
  qualityRow: {
    ...flex.row,
    flexWrap: 'wrap' as const,
    gap: rp(8),
  },
  platformRow: {
    ...flex.row,
    alignItems: 'center' as const,
    gap: rp(8),
    marginBottom: rp(18),
  },
  platformHint: {
    color: colors.textSecondary,
    fontSize: rf(13),
    lineHeight: rl(18),
  },
  actions: {
    gap: rp(10),
    marginBottom: rp(18),
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: rr(16),
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: rp(16),
    marginBottom: rp(18),
  },
  progressLabel: {
    color: colors.textPrimary,
    fontSize: rf(14),
    lineHeight: rl(20),
    fontWeight: '600' as const,
    marginBottom: rp(10),
  },
  track: {
    height: rp(8),
    borderRadius: rr(99),
    backgroundColor: colors.borderSubtle,
    overflow: 'hidden' as const,
  },
  fill: {
    height: '100%' as const,
    borderRadius: rr(99),
    backgroundColor: colors.accent,
  },
  error: {
    color: colors.danger,
    fontSize: rf(13),
    lineHeight: rl(18),
    marginBottom: rp(12),
  },
  success: {
    color: colors.success,
    fontSize: rf(13),
    lineHeight: rl(18),
    marginBottom: rp(12),
  },
  note: {
    color: colors.textMuted,
    fontSize: rf(12),
    lineHeight: rl(18),
    textAlign: 'center' as const,
    marginTop: rp(8),
  },
});
