import type { LucideIcon } from 'lucide-react-native';
import { Download, Images, Sparkles } from 'lucide-react-native';

export type OnboardingSlide = {
  id: string;
  title: string;
  body: string;
  icon: LucideIcon;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'paste',
    title: 'Paste any social link.',
    body: 'Copy from Instagram, TikTok, X, YouTube, and more — drop it into Universal.',
    icon: Sparkles,
  },
  {
    id: 'download',
    title: 'Download in one tap.',
    body: 'We pull the media and save it straight to your Photos on iOS or Gallery on Android.',
    icon: Download,
  },
  {
    id: 'library',
    title: 'Keep a real archive.',
    body: 'Guests save to the device gallery only. Create an account for an Instagram-style grid of everything you downloaded.',
    icon: Images,
  },
];
