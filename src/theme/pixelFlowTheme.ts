import { configure, customTheme } from 'react-native-pixelflow';
import { colors } from './colors';

configure({
  baseWidth: 390,
  baseHeight: 844,
  minFontScale: 0.85,
  maxFontScale: 1.6,
  applyAccessibilityFontScale: true,
});

export const universalTheme = customTheme({
  base: 'dark',
  name: 'obsidian-aurora',
  colors: {
    background: colors.bg,
    surface: colors.surface,
    primary: colors.accent,
    secondary: colors.accentSecondary,
    text: colors.textPrimary,
    textSecondary: colors.textSecondary,
    border: colors.border,
    danger: colors.danger,
    success: colors.success,
    warning: colors.accentWarm,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
});
