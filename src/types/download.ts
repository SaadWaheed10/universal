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
  /** Local cache file path after download. */
  localUri?: string;
  /** Photos / Gallery asset URI after save (best for playback). */
  galleryUri?: string;
  /** Hint for UI — set at download time. */
  mediaKind?: 'video' | 'photo';
  /** True once written to Photos (iOS) / Gallery (Android). */
  savedToGallery: boolean;
  collectionIds: string[];
  createdAt: string;
  status: DownloadStatus;
}
