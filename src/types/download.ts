export type SocialPlatform =
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'x'
  | 'facebook'
  | 'reddit'
  | 'linkedin'
  | 'threads'
  | 'unknown';

export type DownloadStatus =
  | 'queued'
  | 'downloading'
  | 'saved'
  | 'failed';

/** One media download from a social URL. */
export interface DownloadItem {
  id: string;
  url: string;
  cleanedUrl: string;
  platform: SocialPlatform;
  title: string;
  /** Placeholder or local/remote preview for grid tiles. */
  thumbnail?: string;
  host: string;
  /** Local file URI after download (Phase 2). */
  localUri?: string;
  /** True once written to Photos (iOS) / Gallery (Android). */
  savedToGallery: boolean;
  collectionIds: string[];
  createdAt: string;
  status: DownloadStatus;
}
