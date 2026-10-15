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

export type LinkStatus = 'active' | 'broken' | 'pending';

export interface SavedLink {
  id: string;
  url: string;
  cleanedUrl: string;
  platform: SocialPlatform;
  title: string;
  thumbnail?: string;
  host: string;
  note?: string;
  tags: string[];
  collectionIds: string[];
  remindAt?: string;
  createdAt: string;
  status: LinkStatus;
}
