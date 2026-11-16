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
    name: 'Section 01: Hero dan Pengaturan Situs', api_key: 'site_setting', singleton: true,
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
    name: 'Section 02: About Ansorun', api_key: 'about_page', singleton: true,
    fields: [
      plainText('SEO: deskripsi halaman (±155 karakter)', 'meta_description'),
      plainText('Judul section (**tebal**, baris baru boleh)', 'section_title'),
      markdown('Tentang event', 'body', true),
      markdown('Misi sosial', 'mission'),
      plainText('FAQ & Contact: judul (**tebal**)', 'faq_title'),
    ],
  },
  {
    name: 'Section 07: FAQ', api_key: 'faq', sortable: true,
    fields: [str('Pertanyaan', 'question', true), markdown('Jawaban', 'answer', true)],
  },
  {
    name: 'Judul Section Beranda', api_key: 'home_page', singleton: true,
    fields: [
      plainText('SEO: deskripsi halaman (±155 karakter)', 'meta_description'),
      plainText('03 Event Highlights: judul (**tebal**)', 'video_title'),
      str('03 Event Highlights: ID video YouTube (mis. jNQXAC9IVRw)', 'video_id'),
      plainText('04 Race Information: judul (**tebal**)', 'race_title'),
      plainText('04 Rute: judul section (**tebal**)', 'route_title'),
      plainText('05 Prizes & Racepack: judul (**tebal**)', 'prizes_title'),
      plainText('06 How to Join: judul (**tebal**)', 'join_title'),
    ],
  },
  {
    name: 'Halaman 2: Racepack', api_key: 'racepack_page', singleton: true,
    fields: [
      plainText('SEO: deskripsi halaman (±155 karakter)', 'meta_description'),
      image('Hero image', 'hero_image'),
      plainText('Title: Racepack Collection (**tebal**)', 'banner_title'),
      plainText('Headline: GET YOUR RACEPACK. GET READY TO RUN. (**tebal**)', 'title'),
      str('Tanggal pengambilan', 'date'),
      str('Jam operasional', 'hours'),
      str('Lokasi pengambilan', 'venue'),
      markdown('Dokumen yang harus dibawa', 'documents'),
      markdown('Mekanisme pengambilan yang diwakilkan', 'proxy_note'),
      f('File surat kuasa', 'proxy_file', 'file'),
      str('Label tombol surat kuasa', 'proxy_file_label'),
      markdown('Informasi kontak panitia', 'contact'),
    ],
  },
  {
    name: 'Langkah (How to Join dan Racepack)', api_key: 'step_item', sortable: true,
    fields: [
      f('Kelompok (join = How to Join di Beranda, collect = Racepack)', 'group', 'string', {
        validators: { required: {}, enum: { values: ['join', 'collect'] } },
        appearance: { editor: 'string_select', parameters: { options: ['join', 'collect'].map((v) => ({ label: v, value: v })) }, addons: [] },
      }),
      str('Judul', 'title', true),
      markdown('Deskripsi', 'description', true),
      str('Nama ikon (file, mail, id, bag, check, star, ...)', 'icon'),
    ],
  },
  {
    name: 'Section 05: Perlengkapan Racepack', api_key: 'racepack_item', sortable: true,
    fields: [
      str('Judul', 'title', true),
      plainText('Deskripsi', 'description'),
      iconSelect('Ikon', 'icon'),
      str('Caption preview (mis. "Jersey by Brand")', 'caption'),
      image('Gambar preview', 'image'),
    ],
  },
  {
    name: 'Section 04: Race Information', api_key: 'race_info', singleton: true,
    fields: [
      str('Jadwal: tanggal event', 'schedule_date', true),
      markdown('Jadwal: jam start tiap kategori', 'schedule_detail'),
      str('Lokasi: nama tempat', 'location_name'),
      plainText('Lokasi: alamat', 'location_address'),
      url('Lokasi: link peta (Google Maps)', 'location_map_url'),
      image('Lokasi: gambar peta', 'location_map_image'),
      markdown('Rute: catatan umum (peta per kategori diisi di Kategori Lomba)', 'route_detail'),
      url('Rute: link peta (opsional)', 'route_map_url'),
    ],
  },
  {
    name: 'Section 04: Kategori Lomba', api_key: 'race_category', sortable: true,
    fields: [
      str('Nama kategori (mis. 5K)', 'name', true),
      markdown('Detail (biaya, kuota, dst.)', 'detail'),
      markdown('Rute: keterangan rute kategori ini', 'route_detail'),
      image('Rute: gambar peta kategori ini', 'route_map_image'),
    ],
  },
  {
    name: 'Section 05: Hadiah', api_key: 'prize', sortable: true,
    fields: [str('Judul hadiah', 'title', true), plainText('Deskripsi', 'description')],
  },
  {
    name: 'Section 07: Kontak', api_key: 'contact_info', singleton: true,
    fields: [
      str('Email', 'email'),
      str('WhatsApp (format internasional tanpa +, mis. 62812xxxx)', 'whatsapp'),
      markdown('Catatan kontak', 'note'),
    ],
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
