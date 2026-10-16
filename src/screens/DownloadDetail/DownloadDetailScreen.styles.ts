import { flex, rf, rl, rp, rr } from 'react-native-pixelflow';
import { colors } from '../../theme/colors';

export const createDownloadDetailScreenStyles = () => ({
  back: {
    color: colors.accent,
    fontSize: rf(14),
    lineHeight: rl(20),
    fontWeight: '600' as const,
    marginBottom: rp(16),
  },
  preview: {
    width: '100%' as const,
    aspectRatio: 1,
    borderRadius: rr(18),
    overflow: 'hidden' as const,
    backgroundColor: colors.surface,
    marginBottom: rp(18),
  },
  previewImage: {
    width: '100%' as const,
    height: '100%' as const,
  },
  video: {
    width: '100%' as const,
    height: '100%' as const,
    backgroundColor: colors.bg,
  },
  previewFill: {
    flex: 1,
    ...flex.center,
    padding: rp(20),
  },
  playOverlay: {
    ...({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    } as const),
    ...flex.center,
    backgroundColor: 'rgba(7, 7, 10, 0.35)',
  },
  playCircle: {
    width: rp(64),
    height: rp(64),
    borderRadius: rr(99),
    backgroundColor: 'rgba(7, 7, 10, 0.62)',
    ...flex.center,
  },
  tapHint: {
    color: colors.textMuted,
    fontSize: rf(12),
    lineHeight: rl(16),
    textAlign: 'center' as const,
    marginTop: rp(-10),
    marginBottom: rp(16),
  },
  title: {
    color: colors.textPrimary,
    fontSize: rf(22),
    lineHeight: rl(28),
    fontWeight: '700' as const,
    marginBottom: rp(8),
  },
  meta: {
    color: colors.textSecondary,
    fontSize: rf(13),
    lineHeight: rl(18),
    marginBottom: rp(18),
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: rf(12),
    lineHeight: rl(16),
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
    marginBottom: rp(10),
  },
  chipWrap: {
    ...flex.row,
    flexWrap: 'wrap' as const,
    gap: rp(8),
    marginBottom: rp(18),
  },
  collectionChip: {
    borderRadius: rr(99),
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface,
    paddingHorizontal: rp(12),
    paddingVertical: rp(8),
  },
  collectionChipOn: {
    borderColor: colors.accent,
    backgroundColor: colors.accentMuted,
  },
  collectionChipText: {
    color: colors.textSecondary,
    fontSize: rf(13),
    lineHeight: rl(16),
    fontWeight: '500' as const,
  },
  collectionChipTextOn: {
    color: colors.accent,
    fontWeight: '600' as const,
  },
  actions: {
    gap: rp(10),
    marginBottom: rp(16),
  },
  note: {
    color: colors.textMuted,
    fontSize: rf(12),
    lineHeight: rl(18),
    textAlign: 'center' as const,
  },
});
