/**
 * Helper URL gambar. Foto contoh dari Unsplash diberi parameter ukuran + format modern;
 * URL lain (aset lokal di public/brand, dst.) dipakai apa adanya.
 */
export function img(url: string, width = 800): string {
  if (url.includes('images.unsplash.com')) return `${url}${url.includes('?') ? '&' : '?'}auto=format&fit=crop&q=75&w=${width}`;
  return url;
}
