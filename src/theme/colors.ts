/**
 * Obsidian Aurora — elite dark palette (v1 is dark-only).
 */
export const colors = {
  bg: '#07070A',
  bgLifted: '#0C0C12',
  surface: '#111118',
  surfaceElevated: '#1A1A24',
  border: '#2A2A36',
  borderSubtle: '#1E1E28',

  textPrimary: '#F4F4F7',
  textSecondary: '#9A9AA8',
  textMuted: '#6B6B78',

  accent: '#5EEAD4',
  accentSecondary: '#60A5FA',
  accentWarm: '#F5D0A9',
  accentMuted: 'rgba(94, 234, 212, 0.14)',
  accentSecondaryMuted: 'rgba(96, 165, 250, 0.12)',

  danger: '#F87171',
  success: '#34D399',

  orbMint: 'rgba(94, 234, 212, 0.14)',
  orbAzure: 'rgba(96, 165, 250, 0.12)',
  transparent: 'transparent',
  overlay: 'rgba(7, 7, 10, 0.72)',
  white: '#FFFFFF',
} as const;

export type ColorToken = keyof typeof colors;
