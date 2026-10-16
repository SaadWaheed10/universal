/**
 * In-app mirror of docs/PRODUCT_PLAN.md — keep in sync when phases change.
 */

export type ProductPhaseId =
  | '0'
  | '0b'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5';

export type ProductPhaseStatus = 'done' | 'current' | 'upcoming';

export type ProductPhase = {
  id: ProductPhaseId;
  title: string;
  summary: string;
  status: ProductPhaseStatus;
};

/** Active engineering phase — bump when a phase ships. */
/** Next engineering focus after Phase 1 pivot shipped. */
export const CURRENT_PRODUCT_PHASE_ID: ProductPhaseId = '2';

export const PRODUCT_PHASES: ProductPhase[] = [
  {
    id: '0',
    title: 'UI shell',
    summary: 'Theme, tabs, splash, icons',
    status: 'done',
  },
  {
    id: '0b',
    title: 'Onboarding & auth shells',
    summary: 'Welcome, guest, sign up / sign in',
    status: 'done',
  },
  {
    id: '1',
    title: 'Product pivot',
    summary: 'Downloader copy, Downloads tab, guest vs registered gating',
    status: 'done',
  },
  {
    id: '2',
    title: 'Download core',
    summary: 'Paste → download → save to Gallery / Photos (iOS + Android)',
    status: 'current',
  },
  {
    id: '3',
    title: 'Library',
    summary: 'Registered media grid, collections, delete',
    status: 'upcoming',
  },
  {
    id: '4',
    title: 'Polish',
    summary: 'Share intake, retries, privacy toggles',
    status: 'upcoming',
  },
  {
    id: '5',
    title: 'Accounts',
    summary: 'Real auth and library sync',
    status: 'upcoming',
  },
];

export function getCurrentProductPhase(): ProductPhase {
  return (
    PRODUCT_PHASES.find(phase => phase.id === CURRENT_PRODUCT_PHASE_ID) ??
    PRODUCT_PHASES[0]
  );
}
