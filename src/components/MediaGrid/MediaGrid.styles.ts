import { flex, rf, rl, rp, rr } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createMediaGridStyles = () => ({
  grid: {
    ...flex.row,
    flexWrap: 'wrap' as const,
    gap: rp(2),
    paddingBottom: rp(28),
  },
  tile: {
    width: '32.6%' as const,
    aspectRatio: 1,
    borderRadius: rr(4),
    overflow: 'hidden' as const,
    backgroundColor: colors.surface,
  },
  image: {
    ...({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    } as const),
  },
  tileFill: {
    flex: 1,
    ...flex.center,
    padding: rp(8),
  },
  overlay: {
    ...({
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: rp(6),
      paddingVertical: rp(6),
      backgroundColor: 'rgba(7, 7, 10, 0.55)',
    } as const),
  },
  tileLabel: {
    color: colors.textPrimary,
    fontSize: rf(10),
    lineHeight: rl(12),
    fontWeight: '600' as const,
  },
  playBadge: {
    ...({
      position: 'absolute',
      top: rp(6),
      right: rp(6),
      width: rp(22),
      height: rp(22),
      borderRadius: rr(99),
      backgroundColor: 'rgba(7, 7, 10, 0.55)',
    } as const),
    ...flex.center,
  },
});
