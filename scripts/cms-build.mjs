/**
 * Membangun paket CMS untuk cPanel.
 *
 *   npm run cms     (build + zip)
 *
 * 1. Build Astro dengan CMS_BUILD=1 ke folder sementara (.cms-dist).
 * 2. Untuk tiap halaman HTML: cari semua teks dan gambar yang bisa diedit klien, ganti dengan penanda
 *    %%CMS:kunci%%, lalu simpan sebagai templat. Nilai aslinya dicatat di manifest.json.
 * 3. Salin semua yang bukan HTML (CSS, JS, font, gambar) apa adanya.
 * 4. Salin kode PHP dari cpanel/src.
 *
 * Hasil (cpanel/build/) meniru susunan server:
 *   cms/          -> /home/USER/cms/         (privat: kode, templat)
 *   public_html/  -> /home/USER/public_html/ (publik: halaman hasil build + aset + /admin)
 * Zip siap unggah dibuat oleh scripts/cms-pack.mjs (`npm run cms` menjalankan keduanya).
 *
 * Aturan deteksi (semua dibaca dari HTML, komponen Astro tidak perlu diubah):
 *   - elemen yang isinya hanya teks (atau teks + <strong>/<em>/<a href>/<br>) = satu field
 *   - <img src> dan <img alt> = field gambar / teks alternatif
 *   - <title> dan meta deskripsi/OG = field teks
 *   - atribut yang ditandai data-cms-attr-* (lihat src/lib/cms.ts) = field global bernama
 *   - lewati: script, style, svg, [data-cms-skip]
 * Field dengan jenis dan nilai asli yang sama digabung jadi satu (diedit sekali, berlaku di semua tempat).
 */
import { parse } from 'parse5';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { SITE_URL } from './cms-config.mjs';

const ROOT = process.cwd();
const TMP = join(ROOT, '.cms-dist');
const OUT = join(ROOT, 'cpanel/build');
const SRC = join(ROOT, 'cpanel/src');

const SKIP_TAGS = new Set(['script', 'style', 'svg', 'noscript', 'template', 'iframe', 'canvas', 'select', 'textarea', 'head']);
const INLINE_OK = new Set(['strong', 'b', 'em', 'i', 'br', 'a']);
const A_ATTRS_OK = new Set(['href', 'target', 'rel']);
const hasLetter = (s) => /\p{L}/u.test(s.replace(/&[a-zA-Z0-9#]+;/g, ''));

export function transform(html, relPath) {
  const doc = parse(html, { sourceCodeLocationInfo: true });
  const edits = []; // { start, end, text }
  const found = []; // field kemunculan, berurutan sesuai dokumen
  const page = relPath;

  const keyOf = (type, def) => 'f' + createHash('sha1').update(type + '\0' + def).digest('hex').slice(0, 10);
  const slice = (a, b) => html.slice(a, b);
  const attrOf = (el, name) => el.attrs.find((a) => a.name === name);
  const tagOf = (el) => el.tagName;

  function addField({ key, type, def, label, section, start, end, meta }) {
    key ??= keyOf(type, def);
    edits.push({ start, end, text: `%%CMS:${key}%%` });
    found.push({ key, type, def, label, section, page, ...meta });
  }

  // nilai atribut: pecah `name="value"` jadi rentang nilai
  function attrRange(el, name) {
    const loc = el.sourceCodeLocation?.attrs?.[name];
    if (!loc) return null;
    const raw = slice(loc.startOffset, loc.endOffset);
    const m = raw.match(/^[^=]+=(["']?)([\s\S]*?)\1$/);
    if (!m) return null;
    const valueStart = loc.endOffset - m[2].length - m[1].length;
    return { start: valueStart, end: valueStart + m[2].length, value: m[2], whole: loc };
  }

  function removeAttr(el, name) {
    const loc = el.sourceCodeLocation?.attrs?.[name];
    if (!loc) return;
    const from = html[loc.startOffset - 1] === ' ' ? loc.startOffset - 1 : loc.startOffset;
    edits.push({ start: from, end: loc.endOffset, text: '' });
  }

  const sectionLabel = (stack) => {
    for (let i = stack.length - 1; i >= 0; i--) {
      const el = stack[i];
      if (['section', 'header', 'footer', 'main'].includes(tagOf(el))) {
        const id = attrOf(el, 'id')?.value;
        if (id) return id;
        if (['header', 'footer'].includes(tagOf(el))) return tagOf(el);
        const cls = (attrOf(el, 'class')?.value ?? '').split(/\s+/)[0];
        if (cls) return cls;
      }
    }
    return 'halaman';
  };

  const textOf = (n) => (n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(textOf).join(''));
  const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');

  // blok kaya: isinya hanya teks dan inline yang didukung
  function richInfo(el) {
    let hasEl = false;
    let ok = true;
    let hasText = false;
    const visit = (n) => {
      for (const c of n.childNodes ?? []) {
        if (c.nodeName === '#text') {
          if (hasLetter(c.value)) hasText = true;
        } else if (c.nodeName === '#comment') {
          ok = false;
        } else {
          const t = tagOf(c);
          if (!INLINE_OK.has(t)) { ok = false; continue; }
          if (t === 'a' && c.attrs.some((a) => !A_ATTRS_OK.has(a.name))) { ok = false; continue; }
          hasEl = true;
          visit(c);
        }
      }
    };
    visit(el);
    // hanya berisi satu tautan tanpa teks lain: jangan jadikan HTML (tautan dibiarkan, teksnya jadi field sendiri)
    const elKids = el.childNodes.filter((c) => c.nodeName !== '#text');
    const looseText = el.childNodes.some((c) => c.nodeName === '#text' && hasLetter(c.value));
    if (hasEl && !looseText && elKids.length === 1 && tagOf(elKids[0]) === 'a') ok = false;
    return { ok: ok && hasText, hasEl };
  }

  const LABELS = { h1: 'Judul', h2: 'Judul', h3: 'Sub-judul', h4: 'Sub-judul', p: 'Paragraf', a: 'Tautan', button: 'Tombol', li: 'Butir', summary: 'Pertanyaan', label: 'Label', span: 'Teks', div: 'Teks', strong: 'Teks', figcaption: 'Keterangan', td: 'Sel', th: 'Kolom', dt: 'Istilah', dd: 'Keterangan' };

  function handleAttrs(el, section) {
    const t = tagOf(el);
    // penanda global bernama: data-cms-attr-<atribut>="kunci|Label"
    for (const a of el.attrs) {
      if (!a.name.startsWith('data-cms-attr-')) continue;
      const target = a.name.slice('data-cms-attr-'.length);
      const [key, label] = a.value.split('|');
      const r = attrRange(el, target);
      if (r) {
        const type = target === 'href' ? 'url' : target === 'data-countdown' ? 'datetime' : 'text';
        addField({ key, type, def: r.value, label: label ?? key, section, start: r.start, end: r.end, meta: { global: true } });
      }
      removeAttr(el, a.name);
    }
    if (t === 'img') {
      const w = Number(attrOf(el, 'width')?.value) || null;
      const h = Number(attrOf(el, 'height')?.value) || null;
      const alt = attrOf(el, 'alt')?.value ?? '';
      const src = attrRange(el, 'src');
      if (src && src.value && !src.value.startsWith('data:')) {
        addField({ type: 'image', def: src.value, label: `Gambar${alt ? ` — ${decode(alt).slice(0, 40)}` : ''}`, section, start: src.start, end: src.end, meta: { width: w, height: h } });
      }
      const altR = attrRange(el, 'alt');
      if (altR && hasLetter(altR.value)) {
        addField({ type: 'text', def: altR.value, label: `Teks alternatif gambar — ${decode(altR.value).slice(0, 40)}`, section, start: altR.start, end: altR.end, meta: { alt: true } });
      }
    }
  }

  function blockField(el, section, info) {
    const kids = el.childNodes;
    const first = kids[0].sourceCodeLocation;
    const last = kids[kids.length - 1].sourceCodeLocation;
    let start = first.startOffset;
    let end = last.endOffset;
    // buang spasi di tepi supaya indentasi sumber tetap utuh
    const raw = slice(start, end);
    start += raw.length - raw.trimStart().length;
    end -= raw.length - raw.trimEnd().length;
    const def = slice(start, end);
    const t = tagOf(el);
    const snippet = decode(def.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim().slice(0, 48);
    addField({ type: info.hasEl ? 'html' : 'text', def, label: `${LABELS[t] ?? 'Teks'} — ${snippet}`, section, start, end });
  }

  function textRun(node, section, parentTag) {
    const raw = node.value;
    if (!hasLetter(raw)) return;
    const loc = node.sourceCodeLocation;
    let start = loc.startOffset;
    let end = loc.endOffset;
    const src = slice(start, end);
    start += src.length - src.trimStart().length;
    end -= src.length - src.trimEnd().length;
    const def = slice(start, end);
    const snippet = decode(def).replace(/\s+/g, ' ').slice(0, 48);
    addField({ type: 'text', def, label: `${LABELS[parentTag] ?? 'Teks'} — ${snippet}`, section, start, end });
  }

  function walk(node, stack) {
    for (const c of node.childNodes ?? []) {
      if (c.nodeName === '#text') {
        if (stack.length) textRun(c, sectionLabel(stack), tagOf(stack[stack.length - 1]));
        continue;
      }
      if (!c.tagName) continue;
      const t = tagOf(c);
      if (SKIP_TAGS.has(t) || attrOf(c, 'data-cms-skip') || attrOf(c, 'aria-hidden')?.value === 'true') continue;
      const section = sectionLabel(stack.concat(c));
      handleAttrs(c, section);
      if (c.childNodes?.length && t !== 'img') {
        const info = richInfo(c);
        if (info.ok) { blockField(c, section, info); continue; }
      }
      walk(c, stack.concat(c));
    }
  }

  // <head>: judul dan meta
  const htmlEl = doc.childNodes.find((n) => n.tagName === 'html');
  const head = htmlEl?.childNodes.find((n) => n.tagName === 'head');
  const body = htmlEl?.childNodes.find((n) => n.tagName === 'body');
  for (const el of head?.childNodes ?? []) {
    if (el.tagName === 'title' && el.childNodes[0]) {
      const loc = el.childNodes[0].sourceCodeLocation;
      addField({ type: 'text', def: slice(loc.startOffset, loc.endOffset), label: 'Judul halaman (tab browser, Google)', section: 'seo', start: loc.startOffset, end: loc.endOffset });
    }
    if (el.tagName === 'meta') {
      const n = attrOf(el, 'name')?.value ?? attrOf(el, 'property')?.value ?? '';
      if (['description', 'og:title', 'og:description', 'twitter:title', 'twitter:description'].includes(n)) {
        const r = attrRange(el, 'content');
        if (r && r.value) addField({ type: 'text', def: r.value, label: n.includes('title') ? 'Judul halaman (tab browser, Google)' : 'Deskripsi halaman (Google, pratinjau tautan)', section: 'seo', start: r.start, end: r.end });
      }
    }
  }
  if (body) walk(body, []);

  // terapkan penggantian dari belakang
  edits.sort((a, b) => b.start - a.start);
  let out = html;
  for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  return { template: out, found };
}

function walkDir(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walkDir(p) : [p];
  });
}

function main() {
  rmSync(TMP, { recursive: true, force: true });
  rmSync(OUT, { recursive: true, force: true });
  console.log('1/4 build Astro (CMS_BUILD=1)…');
  execSync('npx astro build', { stdio: 'inherit', env: { ...process.env, CMS_BUILD: '1', CMS_OUT_DIR: TMP, SITE_URL } });

  const tplDir = join(OUT, 'cms/tpl');
  const pubDir = join(OUT, 'public_html');
  mkdirSync(tplDir, { recursive: true });
  mkdirSync(pubDir, { recursive: true });

  console.log('2/4 membuat templat…');
  const fields = {};
  const pages = {};
  const templates = [];
  // urutan tampil di admin: Beranda dulu
  const ORDER = ['index.html', 'racepack/index.html', 'galeri/index.html', '404.html'];
  const rank = (rel) => (ORDER.includes(rel) ? ORDER.indexOf(rel) : ORDER.length);
  for (const file of walkDir(TMP).sort((a, b) => rank(relative(TMP, a)) - rank(relative(TMP, b)))) {
    const rel = relative(TMP, file);
    const target = join(pubDir, rel);
    mkdirSync(dirname(target), { recursive: true });
    if (!rel.endsWith('.html')) { cpSync(file, target); continue; }
    const html = readFileSync(file, 'utf8');
    // halaman pengalihan (redirect) dan halaman tanpa isi: salin apa adanya
    if (/http-equiv=["']refresh["']/i.test(html)) { writeFileSync(target, html); continue; }
    if (html.includes('%%CMS:')) throw new Error(`${rel} sudah mengandung penanda %%CMS:`);
    const { template, found } = transform(html, rel);
    const dest = join(tplDir, rel);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, template);
    templates.push(rel);
    pages[rel] = [];
    for (const f of found) {
      if (!pages[rel].includes(f.key)) pages[rel].push(f.key);
      const cur = fields[f.key];
      if (!cur) {
        fields[f.key] = { type: f.type, label: f.label, default: f.def, section: f.section, pages: [rel], ...(f.width && { width: f.width, height: f.height }), ...(f.global && { global: true }), ...(f.alt && { alt: true }) };
      } else {
        if (!cur.pages.includes(rel)) cur.pages.push(rel);
        if (cur.default !== f.def) console.warn(`  ! kunci ${f.key} punya nilai asli berbeda di ${rel}; dipakai yang pertama`);
      }
    }
  }

  console.log('3/4 manifest…');
  const manifest = { base: process.env.BASE_PATH ?? '/', templates, pages, fields };
  writeFileSync(join(tplDir, 'manifest.json'), JSON.stringify(manifest, null, 1));

  // Halaman = hasil build Astro apa adanya (nilai bawaan), supaya situs langsung tayang setelah Extract tanpa CMS.
  for (const rel of templates) {
    const tpl = readFileSync(join(tplDir, rel), 'utf8');
    writeFileSync(join(pubDir, rel), tpl.replace(/%%CMS:([A-Za-z0-9_]+)%%/g, (_, k) => fields[k]?.default ?? ''));
  }

  console.log('4/4 salin kode PHP…');
  if (existsSync(SRC)) cpSync(SRC, OUT, { recursive: true });

  rmSync(TMP, { recursive: true, force: true });
  const n = Object.keys(fields).length;
  console.log(`\nSelesai: ${templates.length} halaman, ${n} field.\nPaket siap di cpanel/build/.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
