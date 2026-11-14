export interface Img {
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
}

/** Teks yang mendukung **tebal** dan baris baru — lihat lib/text.ts */
type RichText = string;

export interface SiteSettings {
  eventName: string;
  bannerTitle: RichText;
  tagline: string;
  metaDescription: string; // SEO: deskripsi Beranda & default
  categories: string;
  eventDate: string; // ISO
  location: string;
  heroEyebrow: string;
  heroHeadline: RichText;
  heroSubheadline: string;
  heroImage: Img | null;
  logo: Img | null;
  primaryColor: string | null; // hex, override tema
  accentColor: string | null;
  registrationUrl: string | null;
  registrationLabel: string;
  countdownTitle: RichText;
  countdownText: string;
  instagramTitle: RichText;
  instagramText: string;
  instagramHandle: string;
  instagramImage: Img | null;
  instagramUrl: string | null;
  galleryTitle: RichText;
  galleryText: string;
  newsletterAction: string | null;
  contactUrl: string | null;
  tiktokUrl: string | null;
  facebookUrl: string | null;
  xUrl: string | null;
  threadsUrl: string | null;
  footerNote: string;
}

export interface Sponsor {
  name: string;
  url: string | null;
  role: string; // "Powered by" | "Presented by" | ...
  logo: Img | null;
}

export interface FooterLink {
  group: string;
  label: string;
  url: string;
}

export interface AboutPage {
  metaDescription: string;
  sectionTitle: RichText;
  eyebrow: string;
  quote: string;
  body: string; // markdown
  faqEyebrow: string;
  faqTitle: RichText;
  faqText: string;
}

export interface Faq {
  question: string;
  answer: string; // markdown
}

export type IconName = 'shirt' | 'medal' | 'bib' | 'bag' | 'star';

export interface RacepackItem {
  title: string;
  description: string;
  icon: IconName | null;
  caption: string | null; // label kecil di preview, mis. "Jersey by Brand"
  image: Img | null;
}

export interface RacepackStep {
  description: string;
  image: Img | null;
}

export interface InfoTab {
  title: string;
  content: string; // markdown
}

export interface LariPage {
  metaDescription: string;
  racepackTitle: RichText;
  racepackIntro: string;
  racepackVenue: string;
  racepackSchedule: string; // markdown
  stepsTitle: string;
  stepsText: string;
  proxyNote: string; // markdown
  proxyFileUrl: string | null;
  proxyFileLabel: string;
  communityTitle: RichText;
  communityText: string;
  communityImage: Img | null;
  communityUrl: string | null;
  infoTitle: RichText;
  infoText: string;
}

export interface GalleryPhoto {
  caption: string | null;
  image: Img | null;
}

export interface SiteData {
  site: SiteSettings;
  sponsors: Sponsor[];
  footerLinks: FooterLink[];
}
