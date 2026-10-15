import { colors } from '../theme/colors';
import type { SocialPlatform } from '../types';

export const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  x: 'X',
  facebook: 'Facebook',
  reddit: 'Reddit',
  linkedin: 'LinkedIn',
  threads: 'Threads',
  unknown: 'Link',
};

export const PLATFORM_PIP: Record<SocialPlatform, string> = {
  instagram: colors.accentWarm,
  tiktok: colors.accent,
  youtube: colors.danger,
  x: colors.textPrimary,
  facebook: colors.accentSecondary,
  reddit: colors.accentWarm,
  linkedin: colors.accentSecondary,
  threads: colors.textSecondary,
  unknown: colors.textMuted,
};
