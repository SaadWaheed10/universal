import { rf, rl, rls } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createAppTextStyles = () => ({
  brand: {
    color: colors.textPrimary,
    fontSize: rf(34),
    lineHeight: rl(40),
    fontWeight: '700' as const,
    letterSpacing: rls(0.4),
  },
  title: {
    color: colors.textPrimary,
    fontSize: rf(22),
    lineHeight: rl(28),
    fontWeight: '600' as const,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: rf(15),
    lineHeight: rl(22),
    fontWeight: '400' as const,
  },
  body: {
    color: colors.textPrimary,
    fontSize: rf(15),
    lineHeight: rl(22),
    fontWeight: '400' as const,
  },
  caption: {
    color: colors.textMuted,
    fontSize: rf(12),
    lineHeight: rl(16),
    fontWeight: '500' as const,
  },
  label: {
    color: colors.textSecondary,
    fontSize: rf(13),
    lineHeight: rl(18),
    fontWeight: '600' as const,
  },
});
