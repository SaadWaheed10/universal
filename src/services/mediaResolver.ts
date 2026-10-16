import type { SocialPlatform } from '../types';
import type { VideoQuality } from '../types/settings';
import { detectPlatform } from '../utils/platformDetect';
import {
  cleanUrl,
  guessMediaKind,
  isDirectMediaUrl,
  normalizeUrl,
} from '../utils/url';
import { getCobaltApiBase } from './cobaltConfig';

export type ResolvedMedia = {
  sourceUrl: string;
  cleanedUrl: string;
  platform: SocialPlatform;
  title: string;
  thumbnail?: string;
  kind: 'video' | 'photo';
  downloadHeaders: Record<string, string>;
};

const BROWSER_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const SOCIAL_CDN_HINT =
  /cdninstagram|fbcdn|tiktokcdn|ttvnw|googlevideo|twimg\.com|video\.twimg/i;

export type ResolveMediaOptions = {
  videoQuality?: VideoQuality;
};

/**
 * Resolve a pasted link into a downloadable media URL.
 * Social pages need a Cobalt tunnel (alwaysProxy). We never download
 * raw social CDN URLs — those return HTTP 403 from the app.
 */
export async function resolveMedia(
  rawUrl: string,
  options: ResolveMediaOptions = {},
): Promise<ResolvedMedia> {
  const cleanedUrl = cleanUrl(rawUrl);
  const platform = detectPlatform(cleanedUrl);
  const downloadHeaders = buildDownloadHeaders(cleanedUrl, platform);
  const videoQuality = options.videoQuality ?? '1080';

  if (isDirectMediaUrl(cleanedUrl) && !SOCIAL_CDN_HINT.test(cleanedUrl)) {
    return {
      sourceUrl: cleanedUrl,
      cleanedUrl,
      platform,
      title: titleFromUrl(cleanedUrl, platform),
      kind: guessMediaKind(cleanedUrl),
      downloadHeaders,
    };
  }

  const cobaltBase = await getCobaltApiBase();
  if (!cobaltBase) {
    throw new Error(
      'Social downloads need a Cobalt API. Official cobalt.tools blocks third-party apps. Host your own instance, then paste its API URL in Settings → Cobalt API.',
    );
  }

  const fromCobalt = await resolveWithCobalt(
    cobaltBase,
    cleanedUrl,
    platform,
    videoQuality,
  );
  if (fromCobalt) {
    return fromCobalt;
  }

  throw new Error(
    `Could not resolve this ${platform === 'unknown' ? '' : `${platform} `}link via Cobalt. Check the API URL in Settings, or try another link.`,
  );
}

function buildDownloadHeaders(
  pageUrl: string,
  platform: SocialPlatform,
): Record<string, string> {
  const referer = platformReferer(platform, pageUrl);
  return {
    'User-Agent': BROWSER_UA,
    Accept: '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    Referer: referer,
    Origin: originFromUrl(referer),
  };
}

function platformReferer(platform: SocialPlatform, pageUrl: string): string {
  switch (platform) {
    case 'instagram':
      return 'https://www.instagram.com/';
    case 'tiktok':
      return 'https://www.tiktok.com/';
    case 'youtube':
      return 'https://www.youtube.com/';
    case 'x':
      return 'https://x.com/';
    case 'facebook':
      return 'https://www.facebook.com/';
    case 'reddit':
      return 'https://www.reddit.com/';
    case 'threads':
      return 'https://www.threads.net/';
    case 'linkedin':
      return 'https://www.linkedin.com/';
    default:
      try {
        const url = new URL(normalizeUrl(pageUrl));
        return `${url.origin}/`;
      } catch {
        return pageUrl;
      }
  }
}

function originFromUrl(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}

async function resolveWithCobalt(
  cobaltBase: string,
  pageUrl: string,
  platform: SocialPlatform,
  videoQuality: VideoQuality,
): Promise<ResolvedMedia | null> {
  const response = await fetch(cobaltBase, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: normalizeUrl(pageUrl),
      downloadMode: 'auto',
      // Critical: tunnel through Cobalt instead of returning CDN redirect (403).
      alwaysProxy: true,
      videoQuality,
      filenameStyle: 'basic',
    }),
  });

  const data = (await response.json().catch(() => null)) as {
    status?: string;
    url?: string;
    filename?: string;
    tunnel?: string[];
    picker?: Array<{ url?: string; type?: string }>;
    error?: { code?: string; message?: string };
  } | null;

  if (!response.ok || !data) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        'Cobalt API rejected the request (auth / bot protection). Use your own Cobalt instance URL in Settings.',
      );
    }
    return null;
  }

  if (data.status === 'error') {
    const code = data.error?.code ?? 'unknown';
    throw new Error(`Cobalt error: ${code}`);
  }

  let sourceUrl = data.url;
  let kind: 'video' | 'photo' = 'video';

  if (data.status === 'local-processing' && Array.isArray(data.tunnel)) {
    sourceUrl = data.tunnel[0];
  }

  if (!sourceUrl && Array.isArray(data.picker) && data.picker.length > 0) {
    const pick =
      data.picker.find(item => item.type === 'video') ?? data.picker[0];
    sourceUrl = pick?.url;
    kind = pick?.type === 'photo' || pick?.type === 'image' ? 'photo' : 'video';
  }

  if (!sourceUrl || !/^https?:\/\//i.test(sourceUrl)) {
    return null;
  }

  // Never download raw social CDN redirects — they 403 from the app.
  if (data.status === 'redirect' || SOCIAL_CDN_HINT.test(sourceUrl)) {
    throw new Error(
      'Cobalt returned a direct CDN link which the app cannot fetch (403). Enable alwaysProxy on your Cobalt instance or update Cobalt.',
    );
  }

  return {
    sourceUrl,
    cleanedUrl: pageUrl,
    platform,
    title:
      data.filename?.replace(/\.[^.]+$/, '') || titleFromUrl(pageUrl, platform),
    kind: guessMediaKind(sourceUrl) === 'photo' ? 'photo' : kind,
    downloadHeaders: {
      'User-Agent': BROWSER_UA,
      Accept: '*/*',
    },
  };
}

function titleFromUrl(url: string, platform: SocialPlatform): string {
  if (platform !== 'unknown') {
    return `${platform[0].toUpperCase()}${platform.slice(1)} download`;
  }
  try {
    const path = new URL(normalizeUrl(url)).pathname.split('/').filter(Boolean);
    return path[path.length - 1] || 'Downloaded media';
  } catch {
    return 'Downloaded media';
  }
}
