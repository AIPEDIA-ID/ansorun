/**
 * Penanda untuk CMS PHP (cpanel/). Hanya aktif saat build CMS (CMS_BUILD=1, lewat `npm run cms`);
 * build biasa tidak berubah. Dipakai untuk nilai global yang muncul di banyak tempat:
 *   <a {...cmsAttr('href', 'registrationUrl', 'Link pendaftaran')}>
 * Teks dan gambar lain terdeteksi otomatis oleh scripts/cms-build.mjs.
 */
export const CMS_BUILD = process.env.CMS_BUILD === '1';

export const cmsAttr = (attr: string, key: string, label: string): Record<string, string> =>
  CMS_BUILD ? { [`data-cms-attr-${attr}`]: `${key}|${label}` } : {};
