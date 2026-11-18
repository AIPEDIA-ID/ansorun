/**
 * Membuat satu zip siap unggah (File Manager cPanel -> Extract di /home/USER/), dari cpanel/build/.
 *
 *   npm run cms     (build + zip)
 *
 *   cpanel/dist/ansorun-<versi>.zip
 *
 * Versi otomatis: cpanel/version.json menyimpan versi terakhir + sidik jari isi build.
 *   - isi berubah -> versi naik (1.0 -> 1.1 -> ... -> 1.10); naikkan major dengan mengedit version.json
 *   - isi sama    -> versi tetap
 * Isi zip = hasil build Astro (situs langsung tayang) + CMS + akun admin (cpanel/local/config.php). Tidak berisi cms/content/ atau uploads/.
 * Setelah update, buka /admin sekali: suntingan klien diterapkan lagi ke halaman baru (otomatis).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const BUILD = 'cpanel/build';
const DIST = 'cpanel/dist';
const VERSION_FILE = 'cpanel/version.json';
if (!existsSync(join(BUILD, 'cms'))) { console.error('Jalankan `npm run cms` (bukan skrip ini langsung).'); process.exit(1); }

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));

const hash = createHash('sha1');
for (const f of walk(BUILD).filter((f) => !f.endsWith('/cms/VERSION')).sort()) hash.update(relative(BUILD, f)).update(readFileSync(f));
const fingerprint = hash.digest('hex').slice(0, 12);

const prev = existsSync(VERSION_FILE) ? JSON.parse(readFileSync(VERSION_FILE, 'utf8')) : null;
const changed = !prev || prev.hash !== fingerprint;
let version = prev?.version ?? '1.0';
if (prev && changed) { const [maj, min] = version.split('.').map(Number); version = `${maj}.${min + 1}`; }
writeFileSync(VERSION_FILE, JSON.stringify({ version, hash: fingerprint }, null, 2) + '\n');
writeFileSync(join(BUILD, 'cms/VERSION'), version + '\n');

// akun admin (hash) ikut zip supaya langsung jadi setelah Extract; dibuat dengan make-config.php, di luar git
const CONFIG = 'cpanel/local/config.php';
const hasConfig = existsSync(CONFIG);
if (hasConfig) copyFileSync(CONFIG, join(BUILD, 'cms/config.php'));
else console.warn('PERINGATAN: cpanel/local/config.php belum ada, admin tidak bisa login. Buat: php cpanel/src/cms/bin/make-config.php <username>');

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
const zip = `ansorun-${version}.zip`;
execSync(`cd ${BUILD} && zip -qr ../dist/${zip} cms public_html -x "*/content/*" "*/state/*" "*/uploads/*" "*.DS_Store"`, { stdio: 'inherit' });

console.log(`Versi ${version}${prev ? (changed ? ` (naik dari ${prev.version})` : ' (isi sama, versi tetap)') : ' (rilis pertama)'}`);
console.log(`Zip: cpanel/dist/${zip}`);
if (changed) console.log(`\nCommit cpanel/version.json, lalu: git tag v${version}`);
