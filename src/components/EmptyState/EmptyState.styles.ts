import { flex, rh, rp, rr, rw } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createEmptyStateStyles = () => ({
  root: {
    ...flex.center,
    flex: 1,
    paddingHorizontal: rp(12),
    paddingBottom: rh(6),
  },
  glow: {
    width: rw(18),
    height: rw(18),
    borderRadius: rr(22),
    marginBottom: rp(28),
    overflow: 'hidden' as const,
    ...flex.center,
    borderWidth: 1,
    borderColor: colors.border,
  },
  glowInner: {
    ...({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    } as const),
  },
  brand: {
    marginBottom: rp(10),
  },
  copy: {
    marginBottom: rp(28),
    maxWidth: rw(78),
  },
  actions: {
    width: '100%' as const,
    maxWidth: rw(78),
    gap: rp(10),
  },
});
