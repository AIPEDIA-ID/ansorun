/**
 * Semua pengambilan konten lewat sini. Halaman/komponen tidak tahu dari mana datanya.
 * Sumber konten saat ini: src/lib/fallback.ts.
 */
import { LOCALE, TIMEZONE } from '../config';
import * as fb from './fallback';
import type { ContactInfo, GalleryPhoto, SiteData } from './types';

export const getSiteData = async (): Promise<SiteData> => ({
  site: fb.site,
  sponsors: fb.sponsors,
  footerLinks: fb.footerLinks,
});

export const getAbout = async () => ({ about: fb.about, faqs: fb.faqs });

export const getHome = async () => ({
  home: fb.home,
  categories: fb.raceCategories,
  raceInfo: fb.raceInfo,
  prizes: fb.prizes,
  items: fb.racepackItems,
  joinSteps: fb.joinSteps,
});

export const getContact = async (): Promise<ContactInfo> => fb.contact;

export const getRacepack = async () => ({ page: fb.racepack, steps: fb.collectSteps });

export const getGallery = async (limit?: number): Promise<GalleryPhoto[]> =>
  limit ? fb.gallery.slice(0, limit) : fb.gallery;

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { dateStyle: 'full' }) {
  return new Intl.DateTimeFormat(LOCALE, { timeZone: TIMEZONE, ...opts }).format(new Date(iso));
}
