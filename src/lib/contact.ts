/** Ubah nomor telepon Indonesia ke link tel: (kembalikan null bila belum berupa nomor lengkap). */
export function telHref(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 9) return null;
  const intl = digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
  return `tel:+${intl}`;
}
