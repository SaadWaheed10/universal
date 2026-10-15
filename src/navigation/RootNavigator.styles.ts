import { flex, rf, rl, rp, rr } from 'react-native-pixelflow';
import { colors } from '../theme/colors';

export const createRootNavigatorStyles = () => ({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.borderSubtle,
    borderTopWidth: 1,
    height: rp(72),
    paddingTop: rp(8),
    paddingBottom: rp(10),
  },
  tabLabel: {
    fontSize: rf(11),
    lineHeight: rl(14),
    fontWeight: '600' as const,
  },
  tabIcon: {
    width: rp(28),
    height: rp(28),
    borderRadius: rr(10),
    ...flex.center,
    marginBottom: rp(2),
  },
  tabIconActive: {
    backgroundColor: colors.accentMuted,
  },
  tabIconInactive: {
    backgroundColor: colors.transparent,
  },
});
