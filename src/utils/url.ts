const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
  'igshid',
  'igsh',
  'si',
  'feature',
  'ref_src',
  'ref_url',
  's',
  't',
]);

const DIRECT_MEDIA_EXT =
  /\.(mp4|m4v|mov|webm|mkv|jpg|jpeg|png|gif|webp|heic|mp3|m4a|aac)(\?|$)/i;

export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return '';
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function isValidHttpUrl(input: string): boolean {
  try {
    const url = new URL(normalizeUrl(input));
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function cleanUrl(input: string): string {
  const normalized = normalizeUrl(input);
  try {
    const url = new URL(normalized);
    const keys = [...url.searchParams.keys()];
    for (const key of keys) {
      if (
        TRACKING_PARAMS.has(key.toLowerCase()) ||
        key.toLowerCase().startsWith('utm_')
      ) {
        url.searchParams.delete(key);
      }
    }
    return `${url.origin}${url.pathname}${url.search}`;
  } catch {
    return normalized;
  }
}

export function getHost(input: string): string {
  try {
    return new URL(normalizeUrl(input)).hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}

export function isDirectMediaUrl(input: string): boolean {
  try {
    const url = new URL(normalizeUrl(input));
    return DIRECT_MEDIA_EXT.test(url.pathname) || DIRECT_MEDIA_EXT.test(url.href);
  } catch {
    return DIRECT_MEDIA_EXT.test(input);
  }
}

export function guessMediaKind(
  input: string,
  contentType?: string,
): 'video' | 'photo' {
  const lowerType = (contentType ?? '').toLowerCase();
  if (lowerType.startsWith('image/')) {
    return 'photo';
  }
  if (lowerType.startsWith('video/')) {
    return 'video';
  }
  if (/\.(jpg|jpeg|png|gif|webp|heic)(\?|$)/i.test(input)) {
    return 'photo';
  }
  return 'video';
}

export function extensionForMedia(
  kind: 'video' | 'photo',
  contentType?: string,
  sourceUrl?: string,
): string {
  const type = (contentType ?? '').toLowerCase();
  if (type.includes('jpeg') || type.includes('jpg')) {
    return 'jpg';
  }
  if (type.includes('png')) {
    return 'png';
  }
  if (type.includes('webp')) {
    return 'webp';
  }
  if (type.includes('gif')) {
    return 'gif';
  }
  if (type.includes('webm')) {
    return 'webm';
  }
  if (type.includes('quicktime') || type.includes('mov')) {
    return 'mov';
  }
  if (sourceUrl) {
    const match = sourceUrl.match(
      /\.(mp4|m4v|mov|webm|jpg|jpeg|png|gif|webp)(?:\?|$)/i,
    );
    if (match) {
      return match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase();
    }
  }
  return kind === 'photo' ? 'jpg' : 'mp4';
}
