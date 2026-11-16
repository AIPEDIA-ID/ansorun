import { marked } from 'marked';

marked.setOptions({ gfm: true });

/** Markdown blok -> HTML (konten CMS) */
export const md = (src: string | null | undefined): string =>
  src ? (marked.parse(src, { async: false }) as string) : '';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Teks judul dari CMS: `**tebal**` jadi <strong>, baris baru jadi <br>.
 * Aman: semua HTML di-escape dulu.
 *   "AYO\n**BERLARI** Lebih Jauh"
 */
export const rich = (src: string | null | undefined): string =>
  escape(src ?? '')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\r?\n/g, '<br>');

/** Nomor lokal (0812...) -> link WhatsApp (wa.me/62812...) */
export const waLink = (phone: string): string => {
  const d = phone.replace(/\D/g, '');
  return `https://wa.me/${d.startsWith('0') ? '62' + d.slice(1) : d}`;
};

/** 082118990008 -> 0821-1899-0008 */
export const fmtPhone = (phone: string): string => phone.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1-');

/** Versi teks polos (untuk <title>, alt, dll.) */
export const plain = (src: string | null | undefined): string =>
  (src ?? '').replace(/\*\*/g, '').replace(/\s*\r?\n\s*/g, ' ').trim();
