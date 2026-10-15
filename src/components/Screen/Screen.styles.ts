import { rp } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createScreenStyles = () => ({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: rp(20),
  },
  contentNoPad: {
    flex: 1,
  },
});
