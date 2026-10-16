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
  tileFill: {
    flex: 1,
    ...flex.center,
    padding: rp(8),
  },
  tileLabel: {
    color: colors.textPrimary,
    fontSize: rf(11),
    lineHeight: rl(14),
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  tileMeta: {
    color: colors.textMuted,
    fontSize: rf(10),
    lineHeight: rl(12),
    fontWeight: '500' as const,
    marginTop: rp(4),
    textAlign: 'center' as const,
  },
});
