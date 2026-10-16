import { isValidHttpUrl, normalizeUrl } from './url';

const DOWNLOADABLE_HINT =
  /instagram|tiktok|youtube|youtu\.be|twitter|x\.com|facebook|reddit|threads|linkedin|\.(mp4|mov|m4v|webm|jpg|jpeg|png|webp|gif)/i;

/** Pull the first http(s) URL out of shared / clipboard text. */
export function extractHttpUrl(text: string): string | null {
  if (!text?.trim()) {
    return null;
  }
  const match = text.match(/https?:\/\/[^\s<>"'\]\)]+/i);
  if (!match?.[0]) {
    return null;
  }
  return match[0].replace(/[.,;:!?]+$/g, '');
}

export function looksLikeDownloadableLink(input: string): boolean {
  if (!isValidHttpUrl(input)) {
    return false;
  }
  return DOWNLOADABLE_HINT.test(normalizeUrl(input));
}

/** Build app deep link used by Android share + clipboard watch. */
export function buildAddDownloadDeepLink(url: string): string {
  return `universal://add?initialUrl=${encodeURIComponent(url.trim())}`;
}
