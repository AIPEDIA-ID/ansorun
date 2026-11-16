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
    .replace(/\r?\n/g, ' <br>'); // spasi sebelum <br> agar pembaca layar tidak menyambung kata

/** Versi teks polos (untuk <title>, alt, dll.) */
export const plain = (src: string | null | undefined): string =>
  (src ?? '').replace(/\*\*/g, '').replace(/\s*\r?\n\s*/g, ' ').trim();
