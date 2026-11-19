/**
 * Racepack item list. Used on the Home page (gear cards) and the /racepack page (item picker).
 * During a CMS build, the list is written out as default JSON for PHP (see racepackListDefaults()).
 */
import type { RacepackItem } from './types';
import { racepackPhoto } from './fallback';
import { ui } from '../config';

// Emoji shown for each item on the racepack page. Items not listed here use DEFAULT_EMOJI.
export const racepackEmoji: Record<string, string> = {
  'Kaos Lari': '👕', Medali: '🏅', 'Nomor Dada': '🎽', 'Tas Serut': '🎒', 'Air Minum': '💧',
  Roti: '🍞', Multivitamin: '💊', 'Kartu E-Money': '💳', 'Kalender Puasa': '📅',
};
export const DEFAULT_EMOJI = '🎁';

/** Default racepack list for the CMS. PHP reads it from the manifest (see cms/lib/cms.php). */
export function racepackListDefaults(items: RacepackItem[]) {
  return {
    tbd: ui.tbd,
    fallback: { src: racepackPhoto.url, alt: racepackPhoto.alt ?? '' },
    items: items.map((it) => ({
      title: it.title,
      description: it.description,
      image: it.image?.url ?? '',
      w: it.image?.width ?? null,
      h: it.image?.height ?? null,
      alt: it.image?.alt ?? '',
      emoji: racepackEmoji[it.title] ?? DEFAULT_EMOJI,
    })),
  };
}
