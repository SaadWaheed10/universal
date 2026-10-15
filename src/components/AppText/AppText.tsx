import type { ReactNode } from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { useScaledStyles } from 'react-native-pixelflow';
import { createAppTextStyles } from './AppText.styles';

type AppTextVariant =
  | 'brand'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'label';

type AppTextProps = TextProps & {
  children: ReactNode;
  variant?: AppTextVariant;
  color?: string;
  align?: TextStyle['textAlign'];
};

export function AppText({
  children,
  variant = 'body',
  color,
  align,
  style,
  ...rest
}: AppTextProps) {
  const styles = useScaledStyles(createAppTextStyles);

  return (
    <Text
      {...rest}
      style={[
        styles[variant],
        color ? { color } : null,
        align ? { textAlign: align } : null,
        style,
      ]}>
      {children}
    </Text>
  );
}
