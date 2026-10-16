import { rp } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createScreenStyles = () => ({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: rp(20),
  },
  contentNoPad: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
