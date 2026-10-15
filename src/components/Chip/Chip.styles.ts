import { flex, rf, rl, rp, rr } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createChipStyles = () => ({
  root: {
    ...flex.row,
    alignItems: 'center' as const,
    gap: rp(6),
    paddingHorizontal: rp(10),
    paddingVertical: rp(6),
    borderRadius: rr(999),
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  pip: {
    width: rp(6),
    height: rp(6),
    borderRadius: rr(999),
  },
  label: {
    color: colors.textSecondary,
    fontSize: rf(12),
    lineHeight: rl(16),
    fontWeight: '600' as const,
  },
});
