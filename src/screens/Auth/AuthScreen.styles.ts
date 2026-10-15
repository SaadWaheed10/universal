import { flex, rf, rl, rp, rr } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createAuthScreenStyles = () => ({
  header: {
    marginBottom: rp(28),
  },
  back: {
    color: colors.accent,
    fontSize: rf(14),
    lineHeight: rl(20),
    fontWeight: '600' as const,
    marginBottom: rp(18),
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: rr(14),
    paddingHorizontal: rp(16),
    paddingVertical: rp(14),
    color: colors.textPrimary,
    fontSize: rf(15),
    lineHeight: rl(20),
  },
  footer: {
    marginTop: rp(18),
    gap: rp(10),
  },
  note: {
    color: colors.textMuted,
    fontSize: rf(12),
    lineHeight: rl(18),
    textAlign: 'center' as const,
    marginTop: rp(8),
  },
  switchRow: {
    ...flex.center,
    marginTop: rp(16),
  },
  switchText: {
    color: colors.textSecondary,
    fontSize: rf(14),
    lineHeight: rl(20),
  },
  switchLink: {
    color: colors.accent,
    fontSize: rf(14),
    lineHeight: rl(20),
    fontWeight: '600' as const,
  },
});
