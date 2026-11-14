/**
 * Semua pengambilan konten lewat sini. Halaman/komponen tidak tahu soal GraphQL.
 * Field kosong di DatoCMS otomatis jatuh ke nilai di fallback.ts.
 */
import { marked } from 'marked';
import { LOCALE, TIMEZONE } from '../config';
import { dato } from './datocms';
import * as fb from './fallback';
import type {
  AboutPage, Faq, GalleryPhoto, InfoTab, LariPage, RacepackItem,
  RacepackStep, SiteData, SiteSettings,
} from './types';

marked.setOptions({ gfm: true, breaks: false });
export const md = (src: string | null | undefined): string => (src ? (marked.parse(src, { async: false }) as string) : '');
export const mdInline = (src: string | null | undefined): string => (src ? (marked.parseInline(src, { async: false }) as string) : '');

/** Buang null / string kosong supaya tidak menimpa fallback */
function defined<T extends object>(obj: T | null | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== ''),
  ) as Partial<T>;
}

/** Pakai list CMS bila ada isinya, kalau tidak pakai fallback */
const listOr = <T>(cms: T[] | null | undefined, fallback: T[]): T[] => (cms && cms.length ? cms : fallback);

const IMG = 'url alt width height';

// Memoize per build agar tiap halaman tidak query ulang
const memo = new Map<string, Promise<unknown>>();
const once = <T>(key: string, fn: () => Promise<T>): Promise<T> => {
  if (!memo.has(key)) memo.set(key, fn());
  return memo.get(key) as Promise<T>;
};

/* ---------------------------------------------------------------- site */
export const getSiteData = () =>
  once<SiteData>('site', async () => {
    const data = await dato<{
      siteSetting: (Omit<SiteSettings, 'primaryColor' | 'accentColor'> & {
        primaryColor: { hex: string } | null;
        accentColor: { hex: string } | null;
      }) | null;
      allSponsors: SiteData['sponsors'];
      allFooterLinks: SiteData['footerLinks'];
    }>(`{
      siteSetting {
        eventName tagline categories eventDate location
        heroHeadline heroSubheadline heroImage { ${IMG} } logo { ${IMG} }
        primaryColor { hex } accentColor { hex }
        registrationUrl registrationLabel newsletterAction contactUrl
        instagramUrl tiktokUrl facebookUrl xUrl threadsUrl footerNote
      }
      allSponsors(orderBy: _position_ASC) { name url role logo { ${IMG} } }
      allFooterLinks(orderBy: _position_ASC) { group label url }
    }`);

    const s = data?.siteSetting;
    return {
      site: {
        ...fb.site,
        ...defined(s),
        primaryColor: s?.primaryColor?.hex ?? null,
        accentColor: s?.accentColor?.hex ?? null,
      },
      sponsors: listOr(data?.allSponsors, fb.sponsors),
      footerLinks: listOr(data?.allFooterLinks, fb.footerLinks),
    };
  });

/* --------------------------------------------------------------- about */
export const getAbout = () =>
  once('about', async () => {
    const data = await dato<{ aboutPage: AboutPage | null; allFaqs: Faq[] }>(`{
      aboutPage { title quote body }
      allFaqs(orderBy: _position_ASC) { question answer }
    }`);
    return {
      about: { ...fb.about, ...defined(data?.aboutPage) } as AboutPage,
      faqs: listOr(data?.allFaqs, fb.faqs),
    };
  });

/* ---------------------------------------------------------------- lari */
export const getLari = () =>
  once('lari', async () => {
    const data = await dato<{
      lariPage: (Omit<LariPage, 'proxyFileUrl'> & { proxyFile: { url: string } | null }) | null;
      allRacepackItems: RacepackItem[];
      allRacepackSteps: RacepackStep[];
      allInfoTabs: InfoTab[];
    }>(`{
      lariPage {
        racepackTitle racepackIntro racepackVenue racepackSchedule stepsTitle
        proxyNote proxyFile { url } proxyFileLabel
        communityTitle communityText communityImage { ${IMG} } communityUrl infoTitle
      }
      allRacepackItems(orderBy: _position_ASC) { title description image { ${IMG} } }
      allRacepackSteps(orderBy: _position_ASC) { description image { ${IMG} } }
      allInfoTabs(orderBy: _position_ASC) { title content }
    }`);
    const { proxyFile, ...rest } = data?.lariPage ?? ({} as NonNullable<typeof data>['lariPage'] & object);
    return {
      lari: { ...fb.lari, ...defined(rest), proxyFileUrl: proxyFile?.url ?? null } as LariPage,
      items: listOr(data?.allRacepackItems, fb.racepackItems),
      steps: listOr(data?.allRacepackSteps, fb.racepackSteps),
      tabs: listOr(data?.allInfoTabs, fb.infoTabs),
    };
  });

/* -------------------------------------------------------------- galeri */
export const getGallery = (limit?: number) =>
  once<GalleryPhoto[]>(`gallery`, async () => {
    const data = await dato<{ allGalleryPhotos: GalleryPhoto[] }>(`{
      allGalleryPhotos(orderBy: _position_ASC, first: 100) { caption image { ${IMG} } }
    }`);
    return listOr(data?.allGalleryPhotos, fb.gallery);
  }).then((all) => (limit ? all.slice(0, limit) : all));

/* -------------------------------------------------------------- format */
export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { dateStyle: 'full' }) {
  return new Intl.DateTimeFormat(LOCALE, { timeZone: TIMEZONE, ...opts }).format(new Date(iso));
}
