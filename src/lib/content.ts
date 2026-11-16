/**
 * Semua pengambilan konten lewat sini. Halaman/komponen tidak tahu soal GraphQL.
 * Field kosong di DatoCMS otomatis jatuh ke nilai di fallback.ts.
 */
import { LOCALE, TIMEZONE } from '../config';
import { dato } from './datocms';
import * as fb from './fallback';
import type {
  AboutPage, ContactInfo, Faq, GalleryPhoto, HomePage, Prize, RaceCategory, RaceInfo,
  RacepackItem, RacepackPage, SiteData, SiteSettings, Step,
} from './types';

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
        eventName bannerTitle tagline metaDescription categories eventDate location
        heroEyebrow heroHeadline heroSubheadline heroImage { ${IMG} } logo { ${IMG} }
        primaryColor { hex } accentColor { hex }
        registrationUrl registrationLabel
        countdownTitle countdownText
        instagramTitle instagramText instagramHandle instagramImage { ${IMG} } instagramUrl
        galleryTitle galleryText
        newsletterAction contactUrl tiktokUrl facebookUrl xUrl threadsUrl footerNote
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
      aboutPage { metaDescription sectionTitle body mission faqTitle }
      allFaqs(orderBy: _position_ASC) { question answer }
    }`);
    return {
      about: { ...fb.about, ...defined(data?.aboutPage) } as AboutPage,
      faqs: listOr(data?.allFaqs, fb.faqs),
    };
  });

/* ---------------------------------------------------------------- home */
export const getHome = () =>
  once('home', async () => {
    const data = await dato<{
      homePage: HomePage | null;
      raceInfo: RaceInfo | null;
      allRaceCategories: RaceCategory[];
      allPrizes: Prize[];
      allRacepackItems: RacepackItem[];
      allStepItems: Step[];
      contactInfo: ContactInfo | null;
    }>(`{
      homePage { metaDescription videoTitle videoId raceTitle routeTitle prizesTitle joinTitle }
      raceInfo {
        scheduleDate scheduleDetail locationName locationAddress locationMapUrl locationMapImage { ${IMG} }
        routeDetail routeMapUrl
      }
      allRaceCategories(orderBy: _position_ASC) { name detail routeDetail routeMapImage { ${IMG} } }
      allPrizes(orderBy: _position_ASC) { title description }
      allRacepackItems(orderBy: _position_ASC) { title description icon caption image { ${IMG} } }
      allStepItems(filter: { group: { eq: "join" } }, orderBy: _position_ASC) { title description icon }
      contactInfo { email whatsapp note }
    }`);
    const info = { ...fb.raceInfo, ...defined(data?.raceInfo) } as RaceInfo;
    return {
      home: { ...fb.home, ...defined(data?.homePage) } as HomePage,
      categories: listOr(data?.allRaceCategories, fb.raceCategories),
      raceInfo: info,
      prizes: listOr(data?.allPrizes, fb.prizes),
      items: listOr(data?.allRacepackItems, fb.racepackItems),
      joinSteps: listOr(data?.allStepItems, fb.joinSteps),
      contact: { ...fb.contact, ...defined(data?.contactInfo) } as ContactInfo,
    };
  });

/* ----------------------------------------------------------- racepack */
type RacepackRaw = Omit<RacepackPage, 'proxyFileUrl'> & { proxyFile: { url: string } | null };

export const getRacepack = () =>
  once('racepack', async () => {
    const data = await dato<{ racepackPage: RacepackRaw | null; allStepItems: Step[] }>(`{
      racepackPage {
        metaDescription heroImage { ${IMG} } bannerTitle title date hours venue documents contact
        proxyNote proxyFile { url } proxyFileLabel
      }
      allStepItems(filter: { group: { eq: "collect" } }, orderBy: _position_ASC) { title description icon }
    }`);
    const { proxyFile, ...rest } = data?.racepackPage ?? ({} as Partial<RacepackRaw>);
    return {
      page: { ...fb.racepack, ...defined(rest), proxyFileUrl: proxyFile?.url ?? null } as RacepackPage,
      steps: listOr(data?.allStepItems, fb.collectSteps),
    };
  });

/* -------------------------------------------------------------- galeri */
export const getGallery = async (limit?: number): Promise<GalleryPhoto[]> => {
  const all = await once<GalleryPhoto[]>('gallery', async () => {
    const data = await dato<{ allGalleryPhotos: GalleryPhoto[] }>(`{
      allGalleryPhotos(orderBy: _position_ASC, first: 100) { caption image { ${IMG} } }
    }`);
    return listOr(data?.allGalleryPhotos, fb.gallery);
  });
  return limit ? all.slice(0, limit) : all;
};

/* -------------------------------------------------------------- format */
export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { dateStyle: 'full' }) {
  return new Intl.DateTimeFormat(LOCALE, { timeZone: TIMEZONE, ...opts }).format(new Date(iso));
}
