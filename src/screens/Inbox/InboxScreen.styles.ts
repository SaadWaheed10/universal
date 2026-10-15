import { flex, rf, rl, rp, rr } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createInboxScreenStyles = () => ({
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
    color: colors.accent,
    fontSize: rf(12),
    lineHeight: rl(16),
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    marginBottom: rp(6),
  },
  addButton: {
    width: rp(44),
    height: rp(44),
    borderRadius: rr(14),
    overflow: 'hidden' as const,
    ...flex.center,
  },
  addGradient: {
    ...({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    } as const),
  },
  list: {
    gap: rp(12),
    paddingBottom: rp(28),
  },
  emptyWrap: {
    flex: 1,
  },
});
