import type { SocialPlatform } from '../types';
import { getHost, normalizeUrl } from './url';

export function detectPlatform(input: string): SocialPlatform {
  const host = getHost(normalizeUrl(input)).toLowerCase();

  if (
    host.includes('instagram.com') ||
    host === 'instagr.am' ||
    host.endsWith('.cdninstagram.com')
  ) {
    return 'instagram';
  }
  if (host.includes('tiktok.com') || host.includes('tiktokv.com')) {
    return 'tiktok';
  }
  if (
    host.includes('youtube.com') ||
    host === 'youtu.be' ||
    host.includes('youtube-nocookie.com')
  ) {
    return 'youtube';
  }
  if (
    host === 'x.com' ||
    host.includes('twitter.com') ||
    host.includes('twimg.com')
  ) {
    return 'x';
  }
  if (host.includes('facebook.com') || host.includes('fb.watch')) {
    return 'facebook';
  }
  if (host.includes('reddit.com') || host.includes('redd.it')) {
    return 'reddit';
  }
  if (host.includes('linkedin.com')) {
    return 'linkedin';
  }
  if (host.includes('threads.net')) {
    return 'threads';
  }
  return 'unknown';
}
