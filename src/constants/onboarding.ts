import type { LucideIcon } from 'lucide-react-native';
import { FolderOpen, Link2, Sparkles } from 'lucide-react-native';

export type OnboardingSlide = {
  id: string;
  title: string;
  body: string;
  icon: LucideIcon;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'capture',
    title: 'Drop any link.',
    body: 'Copy from Instagram, TikTok, X, YouTube, and more — Universal catches it.',
    icon: Link2,
  },
  {
    id: 'clean',
    title: 'We clean the noise.',
    body: 'Tracking junk stripped. Previews ready. One calm inbox for everything you save.',
    icon: Sparkles,
  },
  {
    id: 'keep',
    title: 'Find it when you need it.',
    body: 'Collections, notes, and later queues — your links stay organized, not lost.',
    icon: FolderOpen,
  },
];
