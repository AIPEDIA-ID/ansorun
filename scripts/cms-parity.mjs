/**
 * Uji paritas CMS: halaman yang dirender mesin PHP dari templat (tanpa perubahan konten)
 * harus identik byte-per-byte dengan build Astro biasa.
 *   npm run cms:parity
 * Gagal bila ada komponen yang berubah tapi penandanya tidak cocok.
 */
import { execSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, statSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { SITE_URL } from './cms-config.mjs';

const sh = (cmd) => execSync(cmd, { stdio: 'pipe', encoding: 'utf8', env: { ...process.env, SITE_URL } });
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));

console.log('build biasa…');
sh('npm run build');
console.log('build CMS…');
sh('node scripts/cms-build.mjs');
const out = mkdtempSync(join(tmpdir(), 'cms-parity-'));
console.log(sh(`php cpanel/build/cms/tools/parity.php ${out}`).trim());

let bad = 0;
for (const f of walk(out)) {
  const rel = relative(out, f);
  const same = readFileSync(f, 'utf8') === readFileSync(join('dist', rel), 'utf8');
  console.log(`${same ? 'OK  ' : 'BEDA'} ${rel}`);
  if (!same) bad++;
}
rmSync(out, { recursive: true, force: true });
if (bad) { console.error(`\n${bad} halaman berbeda dari build Astro.`); process.exit(1); }
console.log('\nOK: semua halaman identik.');
