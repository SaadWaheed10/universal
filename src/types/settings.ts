export type VideoQuality = '360' | '720' | '1080' | 'max';

export type AppSettings = {
  clipboardWatchEnabled: boolean;
  autoRetryEnabled: boolean;
  videoQuality: VideoQuality;
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  clipboardWatchEnabled: true,
  autoRetryEnabled: true,
  videoQuality: '1080',
};

export const VIDEO_QUALITY_OPTIONS: Array<{
  value: VideoQuality;
  label: string;
}> = [
  { value: '360', label: '360p' },
  { value: '720', label: '720p' },
  { value: '1080', label: '1080p' },
  { value: 'max', label: 'Max' },
];
