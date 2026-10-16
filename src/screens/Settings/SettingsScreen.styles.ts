import { flex, rf, rl, rp, rr } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createSettingsScreenStyles = () => ({
  header: {
    marginBottom: rp(22),
  },
  eyebrow: {
    color: colors.accentWarm,
    fontSize: rf(12),
    lineHeight: rl(16),
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    marginBottom: rp(6),
  },
  group: {
    backgroundColor: colors.surface,
    borderRadius: rr(18),
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: 'hidden' as const,
    marginBottom: rp(16),
  },
  row: {
    ...flex.between,
    alignItems: 'center' as const,
    paddingHorizontal: rp(16),
    paddingVertical: rp(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    ...flex.row,
    alignItems: 'center' as const,
    gap: rp(12),
    flexShrink: 1,
  },
  rowIcon: {
    width: rp(32),
    height: rp(32),
    borderRadius: rr(10),
    backgroundColor: colors.accentMuted,
    ...flex.center,
  },
  rowLabel: {
    color: colors.textPrimary,
    fontSize: rf(15),
    lineHeight: rl(20),
    fontWeight: '500' as const,
  },
  rowValue: {
    color: colors.textMuted,
    fontSize: rf(13),
    lineHeight: rl(18),
    fontWeight: '500' as const,
  },
  footer: {
    marginTop: rp(8),
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: rf(12),
    lineHeight: rl(16),
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
    marginBottom: rp(8),
    marginTop: rp(4),
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: rr(14),
    paddingHorizontal: rp(16),
    paddingVertical: rp(14),
    color: colors.textPrimary,
    fontSize: rf(14),
    lineHeight: rl(20),
    marginBottom: rp(10),
  },
  helper: {
    color: colors.textMuted,
    fontSize: rf(12),
    lineHeight: rl(18),
    marginBottom: rp(16),
  },
});
