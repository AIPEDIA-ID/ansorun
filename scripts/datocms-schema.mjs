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
    validators: { enum: { values: ['shirt', 'medal', 'bib', 'bag', 'star'] } },
    appearance: {
      editor: 'string_select',
      parameters: { options: ['shirt', 'medal', 'bib', 'bag', 'star'].map((v) => ({ label: v, value: v })) },
      addons: [],
    },
  });

const models = [
  {
    name: 'Site Settings', api_key: 'site_setting', singleton: true,
    fields: [
      str('Nama event (untuk <title>, logo teks)', 'event_name', true),
      plainText('Judul banner halaman dalam (**tebal**, baris baru boleh)', 'banner_title'),
      str('Tagline', 'tagline'),
      plainText('SEO: deskripsi Beranda (±155 karakter)', 'meta_description'),
      str('Kategori (mis. "HM • 10K • 5K")', 'categories'),
      f('Tanggal & jam event', 'event_date', 'date_time', { validators: req }),
      str('Lokasi', 'location', true),
      str('Hero: baris kecil di atas headline', 'hero_eyebrow'),
      plainText('Hero: headline (**tebal**, baris baru boleh)', 'hero_headline'),
      str('Hero: sub-headline', 'hero_subheadline'),
      image('Hero: gambar latar', 'hero_image'),
      image('Logo (kosong = teks nama event)', 'logo'),
      color('Warna utama (override tema)', 'primary_color'),
      color('Warna aksen (override tema)', 'accent_color'),
      url('URL pendaftaran', 'registration_url'),
      str('Label tombol pendaftaran', 'registration_label'),
      plainText('Countdown: judul (**tebal**)', 'countdown_title'),
      str('Countdown: teks', 'countdown_text'),
      plainText('Instagram: judul (**tebal**)', 'instagram_title'),
      str('Instagram: teks', 'instagram_text'),
      str('Instagram: handle', 'instagram_handle'),
      image('Instagram: gambar latar', 'instagram_image'),
      url('Instagram: URL', 'instagram_url'),
      plainText('Galeri: judul (**tebal**)', 'gallery_title'),
      str('Galeri: teks', 'gallery_text'),
      url('Endpoint form newsletter (action URL)', 'newsletter_action'),
      str('Link kontak (mailto: / URL)', 'contact_url'),
      url('TikTok', 'tiktok_url'),
      url('Facebook', 'facebook_url'),
      url('X', 'x_url'),
      url('Threads', 'threads_url'),
      str('Catatan footer', 'footer_note'),
    ],
  },
  {
    name: 'Sponsor', api_key: 'sponsor', sortable: true,
    fields: [
      str('Nama', 'name', true),
      str('Peran (mis. "Powered by", "Presented by")', 'role', true),
      image('Logo', 'logo'),
      url('URL', 'url'),
    ],
  },
  {
    name: 'Footer Link', api_key: 'footer_link', sortable: true,
    fields: [
      str('Grup kolom (mis. "Event", "Peserta")', 'group', true),
      str('Label', 'label', true),
      str('URL (boleh relatif, mis. /tentang)', 'url', true),
    ],
  },
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
  {
    name: 'FAQ', api_key: 'faq', sortable: true,
    fields: [str('Pertanyaan', 'question', true), markdown('Jawaban', 'answer', true)],
  },
  {
    name: 'Halaman Lari', api_key: 'lari_page', singleton: true,
    fields: [
      plainText('SEO: deskripsi halaman (±155 karakter)', 'meta_description'),
      plainText('Judul race pack (**tebal**)', 'racepack_title'),
      plainText('Intro race pack', 'racepack_intro'),
      str('Lokasi pengambilan', 'racepack_venue'),
      markdown('Jadwal pengambilan', 'racepack_schedule'),
      str('Judul langkah pengambilan', 'steps_title'),
      str('Teks langkah pengambilan', 'steps_text'),
      markdown('Catatan diwakilkan', 'proxy_note'),
      f('File surat kuasa', 'proxy_file', 'file'),
      str('Label tombol surat kuasa', 'proxy_file_label'),
      plainText('Komunitas: judul (**tebal**)', 'community_title'),
      plainText('Komunitas: teks', 'community_text'),
      image('Komunitas: gambar latar', 'community_image'),
      url('Komunitas: link', 'community_url'),
      plainText('Informasi event: judul (**tebal**)', 'info_title'),
      plainText('Informasi event: teks', 'info_text'),
    ],
  },
  {
    name: 'Isi Race Pack', api_key: 'racepack_item', sortable: true,
    fields: [
      str('Judul', 'title', true),
      plainText('Deskripsi', 'description'),
      iconSelect('Ikon', 'icon'),
      str('Caption preview (mis. "Jersey by Brand")', 'caption'),
      image('Gambar preview', 'image'),
    ],
  },
  {
    name: 'Langkah Race Pack', api_key: 'racepack_step', sortable: true,
    fields: [plainText('Deskripsi', 'description', true), image('Gambar', 'image')],
  },
  {
    name: 'Tab Informasi Event', api_key: 'info_tab', sortable: true,
    fields: [str('Judul tab', 'title', true), markdown('Isi', 'content', true)],
  },
  {
    name: 'Foto Galeri', api_key: 'gallery_photo', sortable: true,
    fields: [image('Foto', 'image', true), str('Caption', 'caption')],
  },
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
