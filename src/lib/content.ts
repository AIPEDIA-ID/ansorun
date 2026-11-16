/**
 * Semua pengambilan konten lewat sini. Halaman/komponen tidak tahu soal GraphQL.
 * Field kosong di DatoCMS otomatis jatuh ke nilai di fallback.ts.
 */
import { LOCALE, TIMEZONE } from '../config';
import { dato } from './datocms';
import * as fb from './fallback';
import type {
  AboutPage, AboutStep, Beneficiary, Contact, Faq, GalleryPhoto, HomePage, JoinStep, Prize,
  RaceFact, RaceRoute, RacepackInfo, RacepackItem, RacepackPage, RacepackStep, RundownItem,
  SiteData, SiteSettings,
} from './types';

/** Buang null / string kosong supaya tidak menimpa fallback */
function defined<T extends object>(obj: T | null | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== ''),
  ) as Partial<T>;
}

const IMG = 'url alt width height';

// Memoize per build agar tiap halaman tidak query ulang
const memo = new Map<string, Promise<unknown>>();
const once = <T>(key: string, fn: () => Promise<T>): Promise<T> => {
  if (!memo.has(key)) memo.set(key, fn());
  return memo.get(key) as Promise<T>;
};

/** Koleksi berurutan: pakai isi CMS bila ada, kalau tidak pakai fallback. */
const collection = <T>(key: string, query: string, fields: string, fallback: T[], limit = 100) =>
  once<T[]>(key, async () => {
    const data = await dato<Record<string, T[]>>(`{ ${query}(orderBy: _position_ASC, first: ${limit}) { ${fields} } }`);
    const rows = data?.[query];
    return rows && rows.length ? rows : fallback;
  });

/** Singleton: field kosong jatuh ke fallback. */
const singleton = <T extends object>(key: string, query: string, fields: string, fallback: T) =>
  once<T>(key, async () => {
    const data = await dato<Record<string, Partial<T> | null>>(`{ ${query} { ${fields} } }`);
    return { ...fallback, ...defined(data?.[query]) } as T;
  });

/* ---------------------------------------------------------------- site */
export const getSiteData = () =>
  once<SiteData>('site', async () => {
    const data = await dato<{
      siteSetting: (Omit<SiteSettings, 'primaryColor' | 'accentColor'> & {
        primaryColor: { hex: string } | null;
        accentColor: { hex: string } | null;
      }) | null;
    }>(`{
      siteSetting {
        eventName bannerTitle tagline metaDescription categories eventDate location
        heroEyebrow heroHeadline heroSubheadline heroImage { ${IMG} } logo { ${IMG} }
        primaryColor { hex } accentColor { hex }
        registrationUrl registrationLabel
        galleryTitle galleryText
        newsletterAction websiteUrl contactUrl instagramUrl tiktokUrl facebookUrl xUrl threadsUrl footerNote
      }
    }`);
    const s = data?.siteSetting;
    return {
      site: {
        ...fb.site,
        ...defined(s),
        primaryColor: s?.primaryColor?.hex ?? null,
        accentColor: s?.accentColor?.hex ?? null,
      },
      sponsors: await collection('sponsors', 'allSponsors', `name url role logo { ${IMG} }`, fb.sponsors),
      footerLinks: await collection('footerLinks', 'allFooterLinks', 'group label url', fb.footerLinks),
    };
  });

export const getContacts = () => collection<Contact>('contacts', 'allContacts', 'name phone', fb.contacts);
export const getFaqs = () => collection<Faq>('faqs', 'allFaqs', 'question answer', fb.faqs);
export const getRacepackItems = () =>
  collection<RacepackItem>('racepackItems', 'allRacepackItems', `title description icon caption image { ${IMG} }`, fb.racepackItems);

/* ---------------------------------------------------------------- home */
export const getHome = () =>
  once('home', async () => {
    const [home, aboutSteps, beneficiaries, facts, rundown, routes, prizes, joinSteps] = await Promise.all([
      singleton<HomePage>('homePage', 'homePage', `
        aboutTitle aboutBody stepsTitle beneficiariesTitle
        highlightsTitle highlightsText videoUrl videoPoster { ${IMG} }
        raceTitle raceText feeValue feeNote rundownTitle routesTitle
        prizesTitle prizesText racepackTitle racepackText racepackImage { ${IMG} }
        joinTitle joinText faqTitle faqText contactTitle contactText`, fb.home),
      collection<AboutStep>('aboutSteps', 'allAboutSteps', 'title description icon', fb.aboutSteps),
      collection<Beneficiary>('beneficiaries', 'allBeneficiaries', 'title icon', fb.beneficiaries),
      collection<RaceFact>('raceFacts', 'allRaceFacts', 'value note icon', fb.raceFacts),
      collection<RundownItem>('rundown', 'allRundownItems', 'time label', fb.rundown),
      collection<RaceRoute>('routes', 'allRaceRoutes', `title description image { ${IMG} }`, fb.routes),
      collection<Prize>('prizes', 'allPrizes', `quantity title icon image { ${IMG} }`, fb.prizes),
      collection<JoinStep>('joinSteps', 'allJoinSteps', 'title description icon', fb.joinSteps),
    ]);
    return { home, aboutSteps, beneficiaries, facts, rundown, routes, prizes, joinSteps };
  });

/* --------------------------------------------------------------- about */
export const getAbout = () =>
  once('about', async () => ({
    about: await singleton<AboutPage>('aboutPage', 'aboutPage', 'metaDescription sectionTitle eyebrow quote body faqEyebrow faqTitle faqText', fb.about),
    faqs: await getFaqs(),
  }));

/* ------------------------------------------------------------ racepack */
type RacepackRaw = Omit<RacepackPage, 'proxyFileUrl'> & { proxyFile?: { url: string } | null };

export const getRacepack = () =>
  once('racepack', async () => {
    const raw = await singleton<RacepackRaw>('racepackPage', 'racepackPage', `
      metaDescription bannerImage { ${IMG} } title slogan intro stepsTitle itemsTitle itemsText
      proxyFile { url } proxyFileLabel`, { ...fb.racepackPage });
    const { proxyFile, ...rest } = raw;
    const [info, steps, items] = await Promise.all([
      collection<RacepackInfo>('racepackInfo', 'allRacepackDetails', 'title content icon', fb.racepackInfo),
      collection<RacepackStep>('racepackSteps', 'allRacepackSteps', 'title description icon', fb.racepackSteps),
      getRacepackItems(),
    ]);
    return {
      page: { ...rest, proxyFileUrl: proxyFile?.url ?? fb.racepackPage.proxyFileUrl } as RacepackPage,
      info,
      steps,
      items,
    };
  });

/* -------------------------------------------------------------- galeri */
export const getGallery = async (limit?: number): Promise<GalleryPhoto[]> => {
  const all = await collection<GalleryPhoto>('gallery', 'allGalleryPhotos', `caption image { ${IMG} }`, fb.gallery);
  return limit ? all.slice(0, limit) : all;
};

/* -------------------------------------------------------------- format */
export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { dateStyle: 'full' }) {
  return new Intl.DateTimeFormat(LOCALE, { timeZone: TIMEZONE, ...opts }).format(new Date(iso));
}
