import { rh, rr, rw } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createAmbientBackgroundStyles = () => ({
  root: {
    ...({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    } as const),
    backgroundColor: colors.bg,
    overflow: 'hidden' as const,
  },
  wash: {
    ...({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    } as const),
  },
  orbMint: {
    position: 'absolute' as const,
    top: -rh(8),
    left: -rw(18),
    width: rw(72),
    height: rw(72),
    borderRadius: rr(999),
    backgroundColor: colors.orbMint,
  },
  orbAzure: {
    position: 'absolute' as const,
    bottom: rh(8),
    right: -rw(20),
    width: rw(78),
    height: rw(78),
    borderRadius: rr(999),
    backgroundColor: colors.orbAzure,
  },
});
