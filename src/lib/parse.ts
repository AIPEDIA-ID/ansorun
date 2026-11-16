/**
 * Penguraian teks markdown dari konten menjadi data tampilan.
 * Dipisah dari halaman agar index.astro tetap ringkas dan mudah diuji.
 */

export interface RundownRow { time: string; event: string }
export interface Mission {
  title: string;
  flow: { title: string; text: string }[];
  beneficiariesLabel: string;
  beneficiaries: string[];
}

/** Tabel markdown "| 04.30 | Open gate |" -> [{time, event}]. Baris tanpa angka di kolom pertama diabaikan. */
export function parseRundown(scheduleDetail: string | null | undefined): RundownRow[] {
  return (scheduleDetail ?? '')
    .split('\n')
    .filter((l) => l.startsWith('|'))
    .map((l) => l.split('|').slice(1, -1).map((c) => c.trim()))
    .filter((c) => c.length >= 2 && /^\d/.test(c[0]))
    .map(([time, event]) => ({ time, event }));
}

/**
 * Konsep sosial (proposal hal. 4) ditulis sebagai markdown:
 *   **Judul**
 *   1. **Langkah:** keterangan
 *   **Penerima manfaat:** a, b, c
 * Bila formatnya berbeda, `flow` kosong dan halaman menampilkan markdown apa adanya.
 */
export function parseMission(mission: string | null | undefined): Mission {
  const lines = (mission ?? '').split('\n').map((l) => l.trim()).filter(Boolean);
  const title = lines.find((l) => /^\*\*[^*]+\*\*$/.test(l))?.replace(/\*\*/g, '') ?? '';
  const flow = lines
    .map((l) => l.match(/^\d+\.\s+\*\*(.+?)\*\*\s*(.+)$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => ({ title: m[1].replace(/:$/, ''), text: m[2] }));
  const benef = lines.find((l) => /^\*\*Penerima/i.test(l));
  return {
    title,
    flow,
    beneficiariesLabel: benef?.match(/^\*\*(.+?)\*\*/)?.[1].replace(/:$/, '') ?? '',
    beneficiaries: benef ? benef.replace(/^\*\*.+?\*\*\s*/, '').split(',').map((x) => x.trim()).filter(Boolean) : [],
  };
}

/** "**Rp150.000**\n\nKategori umum..." -> "Rp150.000" */
export const priceOf = (detail: string): string => detail.match(/\*\*(Rp[^*]+)\*\*/)?.[1] ?? '';

/** "**Des 2026**\n\nPendaftaran..." -> { date: "Des 2026", body: "Pendaftaran..." } */
export function splitLead(text: string): { lead: string | null; body: string } {
  const m = text.match(/^\*\*(.+?)\*\*\s*([\s\S]*)$/);
  return m ? { lead: m[1], body: m[2] } : { lead: null, body: text };
}
