import type { LucideIcon, LucideProps } from 'lucide-react-native';
import { colors } from '../../theme/colors';

type IconProps = LucideProps & {
  icon: LucideIcon;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/** Shared Lucide wrapper — works the same on iOS and Android via react-native-svg. */
export function Icon({
  icon: LucideGlyph,
  size = 20,
  color = colors.textPrimary,
  strokeWidth = 2,
  ...rest
}: IconProps) {
  return (
    <LucideGlyph
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      {...rest}
    />
  );
}
