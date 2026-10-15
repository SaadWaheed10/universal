import { flex, rf, rl, rp, rr } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createAppButtonStyles = () => ({
  base: {
    ...flex.center,
    borderRadius: rr(14),
    paddingVertical: rp(14),
    paddingHorizontal: rp(20),
    minHeight: rp(48),
  },
  primary: {
    overflow: 'hidden' as const,
  },
  secondary: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
  label: {
    color: colors.bg,
    fontSize: rf(15),
    lineHeight: rl(20),
    fontWeight: '700' as const,
  },
  labelSecondary: {
    color: colors.textPrimary,
    fontSize: rf(15),
    lineHeight: rl(20),
    fontWeight: '600' as const,
  },
  labelGhost: {
    color: colors.accent,
    fontSize: rf(15),
    lineHeight: rl(20),
    fontWeight: '600' as const,
  },
  gradientFill: {
    ...({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    } as const),
  },
});
