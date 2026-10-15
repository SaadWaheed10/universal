import { flex, rf, rh, rl, rp, rr, rw } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createWelcomeScreenStyles = () => ({
  root: {
    flex: 1,
    ...flex.center,
    paddingBottom: rh(4),
  },
  markWrap: {
    width: rw(20),
    height: rw(20),
    borderRadius: rr(22),
    overflow: 'hidden' as const,
    ...flex.center,
    marginBottom: rp(28),
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
  brand: {
    color: colors.textPrimary,
    fontSize: rf(34),
    lineHeight: rl(40),
    fontWeight: '700' as const,
    textAlign: 'center' as const,
    marginBottom: rp(10),
  },
  title: {
    color: colors.textPrimary,
    fontSize: rf(22),
    lineHeight: rl(28),
    fontWeight: '600' as const,
    textAlign: 'center' as const,
    marginBottom: rp(12),
  },
  body: {
    color: colors.textSecondary,
    fontSize: rf(15),
    lineHeight: rl(22),
    fontWeight: '400' as const,
    textAlign: 'center' as const,
    maxWidth: rw(78),
    marginBottom: rp(36),
  },
  actions: {
    width: '100%' as const,
    maxWidth: rw(78),
    gap: rp(10),
  },
});
