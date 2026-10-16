import type { DownloadItem } from '../types';
import type { VideoQuality } from '../types/settings';
import { getHost } from '../utils/url';
import { downloadAndSaveToGallery } from './gallerySave';
import { resolveMedia } from './mediaResolver';

export type DownloadProgressPhase =
  | 'resolving'
  | 'downloading'
  | 'saving'
  | 'done'
  | 'error';

export type DownloadProgress = {
  phase: DownloadProgressPhase;
  ratio: number;
  message: string;
};

export type RunDownloadOptions = {
  rawUrl: string;
  /** When false (guest), item is returned but caller should not persist library. */
  persistInLibrary: boolean;
  videoQuality?: VideoQuality;
  /** Total attempts including the first try. Default 1. */
  maxAttempts?: number;
  onProgress?: (progress: DownloadProgress) => void;
};

export type RunDownloadResult = {
  item: DownloadItem;
  galleryUri: string;
};

function createId(): string {
  return `dl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function runDownloadPipeline(
  options: RunDownloadOptions,
): Promise<RunDownloadResult> {
  const maxAttempts = Math.max(1, options.maxAttempts ?? 1);
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      if (attempt > 1) {
        options.onProgress?.({
          phase: 'resolving',
          ratio: 0.04,
          message: `Retry ${attempt - 1} of ${maxAttempts - 1}…`,
        });
        await sleep(600 * (attempt - 1));
      }
      return await runOnce(options);
    } catch (error) {
      lastError = error;
      if (attempt >= maxAttempts) {
        break;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Download failed. Please try again.');
}

async function runOnce(
  options: RunDownloadOptions,
): Promise<RunDownloadResult> {
  const { rawUrl, onProgress, videoQuality } = options;

  onProgress?.({
    phase: 'resolving',
    ratio: 0.05,
    message: 'Resolving media…',
  });

  const resolved = await resolveMedia(rawUrl, { videoQuality });

  onProgress?.({
    phase: 'downloading',
    ratio: 0.1,
    message: 'Downloading…',
  });

  const saved = await downloadAndSaveToGallery({
    sourceUrl: resolved.sourceUrl,
    headers: resolved.downloadHeaders,
    onProgress: ratio => {
      onProgress?.({
        phase: ratio >= 0.98 ? 'saving' : 'downloading',
        ratio: 0.1 + ratio * 0.85,
        message: ratio >= 0.98 ? 'Saving to gallery…' : 'Downloading…',
      });
    },
  });

  onProgress?.({
    phase: 'saving',
    ratio: 0.96,
    message: 'Saving to gallery…',
  });

  const item: DownloadItem = {
    id: createId(),
    url: rawUrl.trim(),
    cleanedUrl: resolved.cleanedUrl,
    platform: resolved.platform,
    title: resolved.title,
    thumbnail: resolved.thumbnail,
    host: getHost(resolved.cleanedUrl),
    localUri: saved.localFilePath,
    galleryUri: saved.galleryUri,
    mediaKind: saved.kind,
    savedToGallery: true,
    collectionIds: [],
    createdAt: new Date().toISOString(),
    status: 'saved',
  };

  onProgress?.({
    phase: 'done',
    ratio: 1,
    message: 'Saved to Photos / Gallery',
  });

  return {
    item,
    galleryUri: saved.galleryUri,
  };
}
