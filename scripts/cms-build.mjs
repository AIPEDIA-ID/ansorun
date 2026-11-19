/**
 * Builds the CMS package for cPanel.
 *
 *   npm run cms     (build + zip)
 *
 * 1. Build Astro with CMS_BUILD=1 into a temporary folder (.cms-dist).
 * 2. For each HTML page, find all text and images the client can edit, replace them with
 *    %%CMS:key%% markers, and save the result as a template. Original values go into manifest.json.
 * 3. Copy everything that is not HTML (CSS, JS, fonts, images) as is.
 * 4. Copy the PHP code from cpanel/src.
 *
 * The output (cpanel/build/) mirrors the server layout:
 *   cms/          -> /home/USER/cms/         (private: code and templates)
 *   public_html/  -> /home/USER/public_html/ (public: built pages, assets, and the admin folder)
 * scripts/cms-pack.mjs makes the upload zip (`npm run cms` runs both steps).
 *
 * Detection rules (all read from the HTML, so Astro components need no changes):
 *   - an element whose content is only text (or text plus <strong>/<em>/<a href>/<br>) = one field
 *   - <img src> and <img alt> = image field and alt-text field
 *   - <title> and meta description / OG tags = text fields
 *   - attributes marked data-cms-attr-* (see src/lib/cms.ts) = named global fields
 *   - skipped: script, style, svg, and anything with [data-cms-skip] or aria-hidden="true"
 * Fields with the same type and default value are merged into one, so editing it once updates every place.
 */
import { parse } from 'parse5';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { ADMIN_PATH, SITE_URL } from './cms-config.mjs';

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
  const found = []; // field occurrences, in document order
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

  // attribute value: split `name="value"` into the value's range
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

  // rich block: content is only text and supported inline tags
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
    // only one link and no other text: do not make it HTML (the link stays, its text becomes its own field)
    const elKids = el.childNodes.filter((c) => c.nodeName !== '#text');
    const looseText = el.childNodes.some((c) => c.nodeName === '#text' && hasLetter(c.value));
    if (hasEl && !looseText && elKids.length === 1 && tagOf(elKids[0]) === 'a') ok = false;
    return { ok: ok && hasText, hasEl };
  }

  const LABELS = { h1: 'Heading', h2: 'Heading', h3: 'Subheading', h4: 'Subheading', p: 'Paragraph', a: 'Link', button: 'Button', li: 'List item', summary: 'Question', label: 'Label', span: 'Text', div: 'Text', strong: 'Text', figcaption: 'Caption', td: 'Cell', th: 'Column', dt: 'Term', dd: 'Caption' };

  function handleAttrs(el, section) {
    const t = tagOf(el);
    // named global marker: data-cms-attr-<attribute>="key|Label"
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
        addField({ type: 'image', def: src.value, label: `Image${alt ? ` — ${decode(alt).slice(0, 40)}` : ''}`, section, start: src.start, end: src.end, meta: { width: w, height: h } });
      }
      const altR = attrRange(el, 'alt');
      if (altR && hasLetter(altR.value)) {
        addField({ type: 'text', def: altR.value, label: 'Alt text', section, start: altR.start, end: altR.end, meta: { alt: true } });
      }
    }
  }

  function blockField(el, section, info) {
    const kids = el.childNodes;
    const first = kids[0].sourceCodeLocation;
    const last = kids[kids.length - 1].sourceCodeLocation;
    let start = first.startOffset;
    let end = last.endOffset;
    // trim edge whitespace so the source indentation stays intact
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

  // <head>: title and meta tags
  const htmlEl = doc.childNodes.find((n) => n.tagName === 'html');
  const head = htmlEl?.childNodes.find((n) => n.tagName === 'head');
  const body = htmlEl?.childNodes.find((n) => n.tagName === 'body');
  for (const el of head?.childNodes ?? []) {
    if (el.tagName === 'title' && el.childNodes[0]) {
      const loc = el.childNodes[0].sourceCodeLocation;
      addField({ type: 'text', def: slice(loc.startOffset, loc.endOffset), label: 'Page title (browser tab, Google)', section: 'seo', start: loc.startOffset, end: loc.endOffset });
    }
    if (el.tagName === 'meta') {
      const n = attrOf(el, 'name')?.value ?? attrOf(el, 'property')?.value ?? '';
      if (['description', 'og:title', 'og:description', 'twitter:title', 'twitter:description'].includes(n)) {
        const r = attrRange(el, 'content');
        if (r && r.value) addField({ type: 'text', def: r.value, label: n.includes('title') ? 'Page title (browser tab, Google)' : 'Page description (Google preview)', section: 'seo', start: r.start, end: r.end });
      }
    }
  }
  if (body) walk(body, []);

  // apply replacements from the end of the document backwards
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
  const lists = {}; // repeated lists (e.g. racepack): default data from <script data-cms-list>
  const pages = {};
  const templates = [];
  // order in the admin: Home first
  const ORDER = ['index.html', 'racepack/index.html', 'galeri/index.html', '404.html'];
  const rank = (rel) => (ORDER.includes(rel) ? ORDER.indexOf(rel) : ORDER.length);
  for (const file of walkDir(TMP).sort((a, b) => rank(relative(TMP, a)) - rank(relative(TMP, b)))) {
    const rel = relative(TMP, file);
    const target = join(pubDir, rel);
    mkdirSync(dirname(target), { recursive: true });
    if (!rel.endsWith('.html')) { cpSync(file, target); continue; }
    const raw = readFileSync(file, 'utf8');
    const LIST_DATA = /<script type="application\/json" data-cms-list="([a-z0-9_-]+)"[^>]*>([\s\S]*?)<\/script>/g;
    for (const m of raw.matchAll(LIST_DATA)) lists[m[1]] = JSON.parse(m[2]); // list defaults go to the manifest
    const html = raw.replace(LIST_DATA, ''); // keep the data out of the template (PHP reads the manifest)
    // redirect pages and pages without content: copy as they are
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
  const manifest = { base: process.env.BASE_PATH ?? '/', templates, pages, fields, lists };
  writeFileSync(join(tplDir, 'manifest.json'), JSON.stringify(manifest, null, 1));

  // Public pages = a normal Astro build (no CMS markers), so the site is live right after extract
  // and matches exactly what PHP renders from the templates with default values.
  console.log('3b/4 halaman publik (build biasa)…');
  const TMP2 = join(ROOT, '.cms-dist-public');
  rmSync(TMP2, { recursive: true, force: true });
  const plainEnv = { ...process.env, CMS_OUT_DIR: TMP2, SITE_URL };
  delete plainEnv.CMS_BUILD;
  execSync('npx astro build', { stdio: 'inherit', env: plainEnv });
  cpSync(TMP2, pubDir, { recursive: true, force: true });
  rmSync(TMP2, { recursive: true, force: true });

  console.log('4/4 salin kode PHP…');
  if (existsSync(SRC)) cpSync(SRC, OUT, { recursive: true });
  // the admin folder is installed at the secret path (ADMIN_PATH), not /admin
  renameSync(join(pubDir, 'admin'), join(pubDir, ADMIN_PATH));

  rmSync(TMP, { recursive: true, force: true });
  const n = Object.keys(fields).length;
  console.log(`\nSelesai: ${templates.length} halaman, ${n} field.\nPaket siap di cpanel/build/.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
