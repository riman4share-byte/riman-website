import { useSettings } from '../contexts/SettingsContext';

const DEFAULT_FEATURES: Record<string, boolean> = {
  newsletter: true,
  whatsappBtn: true,
  preloader: true,
  instagramFeed: true,
  cookieBanner: true,
  scrollReveal: true,
  threeDViewer: true,
  // Off by default: a 40px pointer that replaces the OS cursor is a strong
  // opinion to ship to everyone on first load. Sites that want it can turn it
  // on in settings; the code path and the `customCursor` toggle remain.
  customCursor: false,
  virtualTryOn: false,
};

export function useFeature(key: string): boolean {
  const { settings } = useSettings();
  const features: Record<string, boolean> = { ...DEFAULT_FEATURES, ...settings.features };
  return features[key] ?? true;
}
