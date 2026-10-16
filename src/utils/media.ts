import type { DownloadItem } from '../types';

export function toFileUri(pathOrUri: string): string {
  if (
    pathOrUri.startsWith('file://') ||
    pathOrUri.startsWith('ph://') ||
    pathOrUri.startsWith('content://') ||
    pathOrUri.startsWith('assets-library://') ||
    /^https?:\/\//i.test(pathOrUri)
  ) {
    return pathOrUri;
  }

  // Encode each path segment so spaces/special chars work on iOS.
  const absolute = pathOrUri.startsWith('/') ? pathOrUri : `/${pathOrUri}`;
  const encoded = absolute
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');
  return `file://${encoded}`;
}

export function isImagePath(uri: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|heic)(\?|$)/i.test(uri);
}

export function isVideoPath(uri: string): boolean {
  return /\.(mp4|m4v|mov|webm|mkv)(\?|$)/i.test(uri);
}

/** Best local URI for in-app playback (prefer persistent local file). */
export function getPlaybackUri(item: DownloadItem): string | undefined {
  if (item.mediaKind === 'photo') {
    return undefined;
  }

  // Prefer local file with a clear video extension.
  if (item.localUri && isVideoPath(item.localUri)) {
    return toFileUri(item.localUri);
  }

  // Persistent local path without extension check when marked as video.
  if (item.localUri && item.mediaKind === 'video') {
    return toFileUri(item.localUri);
  }

  // Gallery asset URIs (ph:// / content://) — try as last resort.
  if (item.galleryUri && !isImagePath(item.galleryUri)) {
    return toFileUri(item.galleryUri);
  }

  if (item.localUri && !isImagePath(item.localUri)) {
    return toFileUri(item.localUri);
  }

  return undefined;
}

export function getPreviewImageUri(item: DownloadItem): string | undefined {
  if (item.thumbnail && /^https?:\/\//i.test(item.thumbnail)) {
    return item.thumbnail;
  }
  if (item.localUri && isImagePath(item.localUri)) {
    return toFileUri(item.localUri);
  }
  if (item.galleryUri && isImagePath(item.galleryUri)) {
    return toFileUri(item.galleryUri);
  }
  return undefined;
}

export function itemLooksLikeVideo(item: DownloadItem): boolean {
  if (item.mediaKind === 'video') {
    return true;
  }
  if (item.mediaKind === 'photo') {
    return false;
  }
  if (item.localUri && isVideoPath(item.localUri)) {
    return true;
  }
  return Boolean(getPlaybackUri(item));
}
