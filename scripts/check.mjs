/**
 * Pagar kualitas ringan: warna tidak boleh ditulis langsung di luar blok TOKENS
 * theme.css (supaya ganti tema cukup di satu tempat), lalu build harus lolos.
 *   npm run check
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const COLOR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/;
const problems = [];

// 1. theme.css: hanya blok :root pertama (TOKENS) yang boleh berisi warna mentah.
const css = readFileSync('src/styles/theme.css', 'utf8').split('\n');
const tokensEnd = css.findIndex((l) => l.includes('Turunan otomatis'));
css.forEach((line, i) => {
  if (i < tokensEnd) return;
  if (/mask|rgb\(0 0 0 \//.test(line)) return; // mask-image & bayangan hitam
  if (COLOR.test(line)) problems.push(`theme.css:${i + 1}  ${line.trim()}`);
});

// 2. markup & ts: tidak boleh ada warna mentah.
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
for (const f of walk('src').filter((f) => /\.(astro|ts)$/.test(f))) {
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    if (COLOR.test(line)) problems.push(`${f}:${i + 1}  ${line.trim()}`);
  });
}

if (problems.length) {
  console.error('Warna mentah ditemukan (pakai token di theme.css):\n' + problems.join('\n'));
  process.exit(1);
}
console.log('OK: tidak ada warna mentah di luar token.');
execSync('npx astro build', { stdio: 'inherit' });
