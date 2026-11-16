/**
 * Halaman yang filenya ada di src/pages tetapi belum ditampilkan ke publik
 * (tidak ada di menu, footer, sitemap, dan diberi noindex).
 * Untuk mengaktifkan lagi: hapus path-nya dari daftar ini.
 */
export const HIDDEN_PATHS = ['/tentang', '/galeri'];

export const isLive = (path) => !HIDDEN_PATHS.includes(path.replace(/\/$/, '') || '/');
