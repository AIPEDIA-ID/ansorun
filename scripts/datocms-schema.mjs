/**
 * Membuat model & field DatoCMS yang dibutuhkan situs ini. Idempotent:
 * model yang sudah ada (berdasarkan api_key) dilewati.
 *
 *   DATOCMS_CMA_TOKEN=xxxx npm run dato:schema
 *
 * Gunakan token "Full-access API token". Disarankan dicoba dulu di sandbox
 * environment (DATOCMS_ENVIRONMENT=sandbox-1) sebelum ke primary.
 */
import { buildClient } from '@datocms/cma-client-node';
import { ICON_NAMES } from '../src/lib/icon-names.mjs';

const apiToken = process.env.DATOCMS_CMA_TOKEN;
if (!apiToken) {
  console.error('DATOCMS_CMA_TOKEN belum di-set.');
  process.exit(1);
}
const client = buildClient({ apiToken, environment: process.env.DATOCMS_ENVIRONMENT || undefined });

/* ---- helper field ---- */
const req = { required: {} };
const f = (label, api_key, field_type, extra = {}) => ({ label, api_key, field_type, ...extra });
const str = (label, key, required = false, extra = {}) =>
  f(label, key, 'string', { validators: required ? req : {}, ...extra });
const url = (label, key) =>
  f(label, key, 'string', { validators: { format: { predefined_pattern: 'url' } } });
const markdown = (label, key, required = false) =>
  f(label, key, 'text', {
    validators: required ? req : {},
    appearance: {
      editor: 'markdown',
      parameters: { toolbar: ['heading', 'bold', 'italic', 'unordered_list', 'ordered_list', 'quote', 'link', 'image'] },
      addons: [],
    },
  });
const plainText = (label, key, required = false) =>
  f(label, key, 'text', { validators: required ? req : {}, appearance: { editor: 'textarea', parameters: { placeholder: '' }, addons: [] } });
const image = (label, key, required = false) =>
  f(label, key, 'file', { validators: { ...(required ? req : {}), extension: { predefined_list: 'image' } } });
const color = (label, key) =>
  f(label, key, 'color', { appearance: { editor: 'color_picker', parameters: { enable_alpha: false, preset_colors: [] }, addons: [] } });

/* ---- model ---- */
const iconSelect = (label, key) =>
  f(label, key, 'string', {
    validators: { enum: { values: [...ICON_NAMES] } },
    appearance: {
      editor: 'string_select',
      parameters: { options: ICON_NAMES.map((v) => ({ label: v, value: v })) },
      addons: [],
    },
  });
const file = (label, key) => f(label, key, 'file');

const models = [
  {
    name: 'Site Settings', api_key: 'site_setting', singleton: true,
    fields: [
      str('Nama event (untuk <title>, logo teks)', 'event_name', true),
      plainText('Judul banner halaman dalam (**tebal**, baris baru boleh)', 'banner_title'),
      str('Tagline', 'tagline'),
      plainText('SEO: deskripsi Beranda (±155 karakter)', 'meta_description'),
      str('Kategori (mis. "5K • 10K")', 'categories'),
      f('Tanggal & jam event', 'event_date', 'date_time', { validators: req }),
      str('Lokasi', 'location', true),
      str('Hero: baris kecil di atas headline', 'hero_eyebrow'),
      plainText('Hero: headline (**tebal**, baris baru boleh)', 'hero_headline'),
      str('Hero: sub-headline', 'hero_subheadline'),
      image('Hero: gambar latar', 'hero_image'),
      image('Hero: KV lengkap (sudah berisi judul; bila diisi, hero memakai layout KV)', 'hero_kv'),
      image('Logo untuk latar gelap (di atas hero & footer)', 'logo'),
      image('Logo untuk latar terang (header putih; kosong = logo di atas dipakai dengan filter)', 'logo_on_light'),
      color('Warna utama (override tema)', 'primary_color'),
      color('Warna aksen (override tema)', 'accent_color'),
      url('URL pendaftaran', 'registration_url'),
      str('Label tombol pendaftaran', 'registration_label'),
      plainText('Galeri: judul (**tebal**)', 'gallery_title'),
      str('Galeri: teks', 'gallery_text'),
      url('Endpoint form newsletter (action URL)', 'newsletter_action'),
      url('Website resmi', 'website_url'),
      str('Link email kontak (mailto: / URL)', 'contact_url'),
      url('Instagram', 'instagram_url'),
      url('TikTok', 'tiktok_url'),
      url('Facebook', 'facebook_url'),
      url('X', 'x_url'),
      url('Threads', 'threads_url'),
      str('Catatan footer', 'footer_note'),
    ],
  },
  {
    name: 'Halaman Beranda', api_key: 'home_page', singleton: true,
    fields: [
      plainText('About: judul (**tebal**, baris baru boleh)', 'about_title'),
      markdown('About: isi ringkas', 'about_body'),
      str('Konsep sosial: judul', 'steps_title'),
      str('Penerima manfaat: judul', 'beneficiaries_title'),
      plainText('Highlights: judul (**tebal**)', 'highlights_title'),
      str('Highlights: teks', 'highlights_text'),
      url('Highlights: link video YouTube (kosong = placeholder)', 'video_url'),
      image('Highlights: poster video (kosong = thumbnail YouTube)', 'video_poster'),
      plainText('Race information: judul (**tebal**)', 'race_title'),
      str('Race information: teks', 'race_text'),
      str('Biaya pendaftaran (teks bebas)', 'fee_value'),
      plainText('Catatan biaya', 'fee_note'),
      str('Judul rundown', 'rundown_title'),
      str('Judul rute', 'routes_title'),
      plainText('Prizes & racepack: judul (**tebal**)', 'prizes_title'),
      str('Prizes & racepack: teks', 'prizes_text'),
      str('Judul race pack peserta', 'racepack_title'),
      str('Teks race pack peserta', 'racepack_text'),
      image('Gambar race pack (flat-lay)', 'racepack_image'),
      plainText('How to join: judul (**tebal**)', 'join_title'),
      str('How to join: teks', 'join_text'),
      plainText('FAQ & kontak: judul (**tebal**)', 'faq_title'),
      str('FAQ & kontak: teks', 'faq_text'),
      str('Kontak: judul', 'contact_title'),
      str('Kontak: teks', 'contact_text'),
    ],
  },
  { name: 'Sponsor', api_key: 'sponsor', sortable: true,
    fields: [str('Nama', 'name', true), str('Peran (mis. "Powered by")', 'role', true), image('Logo', 'logo'), url('URL', 'url')] },
  { name: 'Footer Link', api_key: 'footer_link', sortable: true,
    fields: [str('Grup kolom (mis. "Event")', 'group', true), str('Label', 'label', true), str('URL (boleh relatif, mis. /tentang)', 'url', true)] },
  { name: 'Kontak Panitia', api_key: 'contact', sortable: true,
    fields: [str('Nama', 'name', true), str('Nomor telepon', 'phone', true)] },
  { name: 'Langkah Konsep Sosial', api_key: 'about_step', sortable: true,
    fields: [str('Judul', 'title', true), plainText('Deskripsi', 'description'), iconSelect('Ikon', 'icon')] },
  { name: 'Penerima Manfaat', api_key: 'beneficiary', sortable: true,
    fields: [str('Judul', 'title', true), iconSelect('Ikon', 'icon')] },
  { name: 'Info Race (kartu)', api_key: 'race_fact', sortable: true,
    fields: [str('Nilai (mis. "31 Jan 2027")', 'value', true), str('Keterangan', 'note'), iconSelect('Ikon', 'icon')] },
  { name: 'Rundown', api_key: 'rundown_item', sortable: true,
    fields: [str('Jam (mis. "05.30")', 'time', true), str('Acara', 'label', true)] },
  { name: 'Rute Lari', api_key: 'race_route', sortable: true,
    fields: [str('Judul (mis. "Rute 5K")', 'title', true), markdown('Keterangan rute', 'description'), image('Gambar peta', 'image')] },
  { name: 'Hadiah', api_key: 'prize', sortable: true,
    fields: [str('Jumlah (mis. "5")', 'quantity', true), str('Nama hadiah', 'title', true), image('Foto hadiah (PNG transparan paling bagus)', 'image'), iconSelect('Ikon (cadangan bila tanpa foto)', 'icon')] },
  { name: 'Langkah Cara Daftar', api_key: 'join_step', sortable: true,
    fields: [str('Judul', 'title', true), plainText('Deskripsi', 'description'), iconSelect('Ikon', 'icon')] },
  {
    name: 'Halaman Tentang', api_key: 'about_page', singleton: true,
    fields: [
      plainText('SEO: deskripsi halaman (±155 karakter)', 'meta_description'),
      plainText('Judul section (**tebal**, baris baru boleh)', 'section_title'),
      str('Label di atas isi', 'eyebrow'),
      plainText('Kutipan', 'quote'),
      markdown('Isi', 'body', true),
      str('FAQ: label kecil', 'faq_eyebrow'),
      plainText('FAQ: judul (**tebal**)', 'faq_title'),
      str('FAQ: teks', 'faq_text'),
    ],
  },
  { name: 'FAQ', api_key: 'faq', sortable: true,
    fields: [str('Pertanyaan', 'question', true), markdown('Jawaban', 'answer', true)] },
  {
    name: 'Halaman Racepack', api_key: 'racepack_page', singleton: true,
    fields: [
      plainText('SEO: deskripsi halaman (±155 karakter)', 'meta_description'),
      image('Banner: gambar latar', 'banner_image'),
      plainText('Judul (**tebal**, baris baru boleh)', 'title'),
      str('Slogan', 'slogan'),
      plainText('Intro', 'intro'),
      plainText('Judul tiga langkah (**tebal**)', 'steps_title'),
      plainText('Judul isi race pack (**tebal**)', 'items_title'),
      str('Teks isi race pack', 'items_text'),
      file('File surat kuasa', 'proxy_file'),
      str('Label tombol surat kuasa', 'proxy_file_label'),
    ],
  },
  { name: 'Info Pengambilan Racepack', api_key: 'racepack_detail', sortable: true,
    fields: [str('Judul (mis. "Jam operasional")', 'title', true), markdown('Isi', 'content', true), iconSelect('Ikon', 'icon')] },
  { name: 'Langkah Pengambilan Racepack', api_key: 'racepack_step', sortable: true,
    fields: [str('Judul', 'title', true), plainText('Deskripsi', 'description'), iconSelect('Ikon', 'icon')] },
  { name: 'Isi Race Pack', api_key: 'racepack_item', sortable: true,
    fields: [
      str('Judul', 'title', true), plainText('Deskripsi', 'description'), iconSelect('Ikon', 'icon'),
      str('Caption preview', 'caption'), image('Gambar preview (kosong = gambar race pack Beranda)', 'image'),
    ] },
  { name: 'Foto Galeri', api_key: 'gallery_photo', sortable: true,
    fields: [image('Foto', 'image', true), str('Caption', 'caption')] },
];

const existing = new Set((await client.itemTypes.list()).map((m) => m.api_key));

for (const m of models) {
  if (existing.has(m.api_key)) {
    console.log(`- skip   ${m.api_key} (sudah ada)`);
    continue;
  }
  const { fields, ...attrs } = m;
  const created = await client.itemTypes.create({
    ...attrs,
    singleton: attrs.singleton ?? false,
    sortable: attrs.sortable ?? false,
    draft_mode_active: false,
  });
  for (const field of fields) {
    await client.fields.create(created.id, field);
  }
  console.log(`+ buat   ${m.api_key} (${fields.length} field)`);
}
console.log('Selesai. Isi konten di DatoCMS, lalu rebuild situs.');
