export interface Img {
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface SiteSettings {
  eventName: string;
  tagline: string;
  categories: string;
  eventDate: string; // ISO
  location: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: Img | null;
  logo: Img | null;
  primaryColor: string | null; // hex, override tema
  accentColor: string | null;
  registrationUrl: string | null;
  registrationLabel: string;
  newsletterAction: string | null;
  contactUrl: string | null;
  instagramUrl: string | null;
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
  title: string;
  quote: string;
  body: string; // markdown
}

export interface Faq {
  question: string;
  answer: string; // markdown
}

export interface RacepackItem {
  title: string;
  description: string;
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
  racepackTitle: string;
  racepackIntro: string;
  racepackVenue: string;
  racepackSchedule: string; // markdown
  stepsTitle: string;
  proxyNote: string; // markdown
  proxyFileUrl: string | null;
  proxyFileLabel: string;
  communityTitle: string;
  communityText: string;
  communityImage: Img | null;
  communityUrl: string | null;
  infoTitle: string;
}

export interface GalleryPhoto {
  caption: string | null;
  image: Img;
}

export interface SiteData {
  site: SiteSettings;
  sponsors: Sponsor[];
  footerLinks: FooterLink[];
}
