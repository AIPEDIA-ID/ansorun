<?php
/**
 * Uji paritas: render semua templat TANPA perubahan konten ke folder tujuan.
 * Hasilnya harus identik byte-per-byte dengan build Astro biasa (dist/).
 *   php cms/tools/parity.php /tmp/hasil
 */
require __DIR__ . '/../lib/cms.php';
$out = $argv[1] ?? '';
if ($out === '') { fwrite(STDERR, "Pakai: php parity.php <folder-tujuan>\n"); exit(2); }
$pages = cms_render_all([]);
foreach ($pages as $rel => $html) cms_write("$out/$rel", $html);
echo count($pages) . " halaman dirender ke $out\n";
