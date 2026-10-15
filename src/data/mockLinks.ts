import type { SavedLink } from '../types';

/** UI-only mock data for Phase 0 empty/populated previews. */
export const MOCK_LINKS: SavedLink[] = [
  {
    id: '1',
    url: 'https://www.instagram.com/reel/abc123/?igshid=xyz',
    cleanedUrl: 'https://www.instagram.com/reel/abc123',
    platform: 'instagram',
    title: 'Quiet morning desk setup',
    host: 'instagram.com',
    tags: ['design'],
    collectionIds: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'active',
  },
  {
    id: '2',
    url: 'https://www.youtube.com/watch?v=dQw4w9wg&utm_source=share',
    cleanedUrl: 'https://www.youtube.com/watch?v=dQw4w9wg',
    platform: 'youtube',
    title: 'System design in 12 minutes',
    host: 'youtube.com',
    tags: ['learn'],
    collectionIds: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: 'active',
  },
  {
    id: '3',
    url: 'https://x.com/someone/status/123?s=20',
    cleanedUrl: 'https://x.com/someone/status/123',
    platform: 'x',
    title: 'Thread on shipping slow and clean',
    host: 'x.com',
    tags: ['product'],
    collectionIds: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    status: 'active',
  },
];
