import { flex, rf, rh, rl, rp, rr, rw } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createOnboardingScreenStyles = () => ({
  root: {
    flex: 1,
  },
  topBar: {
    ...flex.between,
    alignItems: 'center' as const,
    paddingHorizontal: rp(4),
    marginBottom: rp(8),
  },
  skip: {
    color: colors.textMuted,
    fontSize: rf(14),
    lineHeight: rl(20),
    fontWeight: '600' as const,
    paddingVertical: rp(8),
    paddingHorizontal: rp(4),
  },
  pager: {
    flex: 1,
  },
  page: {
    width: rw(100) - rp(40),
    ...flex.center,
    paddingHorizontal: rp(8),
  },
  markWrap: {
    width: rw(22),
    height: rw(22),
    borderRadius: rr(24),
    overflow: 'hidden' as const,
    ...flex.center,
    marginBottom: rp(32),
    borderWidth: 1,
    borderColor: colors.border,
  },
  markGradient: {
    ...({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    } as const),
  },
  title: {
    color: colors.textPrimary,
    fontSize: rf(30),
    lineHeight: rl(36),
    fontWeight: '700' as const,
    textAlign: 'center' as const,
    marginBottom: rp(14),
  },
  body: {
    color: colors.textSecondary,
    fontSize: rf(16),
    lineHeight: rl(24),
    fontWeight: '400' as const,
    textAlign: 'center' as const,
    maxWidth: rw(78),
  },
  footer: {
    paddingBottom: rh(2),
    gap: rp(18),
  },
  dots: {
    ...flex.row,
    ...flex.center,
    gap: rp(8),
  },
  dot: {
    width: rp(7),
    height: rp(7),
    borderRadius: rr(999),
    backgroundColor: colors.border,
  },
  dotActive: {
    width: rp(22),
    backgroundColor: colors.accent,
  },
});
