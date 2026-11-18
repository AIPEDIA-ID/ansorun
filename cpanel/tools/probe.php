<?php
/**
 * Pemeriksaan hosting (hanya baca + satu file uji yang langsung dihapus).
 * Unggah sementara ke public_html, buka di browser, salin hasilnya, lalu HAPUS file ini.
 */
header('Content-Type: text/plain; charset=utf-8');
header('X-Robots-Tag: noindex');
$root = rtrim($_SERVER['DOCUMENT_ROOT'] ?? __DIR__, '/');
$home = dirname($root);
function ok($b) { return $b ? 'YA ' : 'TIDAK'; }
echo "PHP            : " . PHP_VERSION . ' (' . PHP_SAPI . ")  [butuh >= 8.0]\n";
foreach (['json', 'mbstring', 'gd', 'fileinfo', 'session'] as $e) echo str_pad("ekstensi $e", 15) . ': ' . ok(extension_loaded($e)) . "\n";
echo "GD WebP        : " . ok(function_exists('imagewebp')) . "  [opsional; tanpa ini gambar disimpan apa adanya]\n";
echo "document root  : $root\nfolder home    : $home\n";
echo "open_basedir   : " . (ini_get('open_basedir') ?: '(tidak dibatasi)') . "\n";
echo "upload_max     : " . ini_get('upload_max_filesize') . "  post_max: " . ini_get('post_max_size') . "  memory: " . ini_get('memory_limit') . "  waktu: " . ini_get('max_execution_time') . "s\n";
echo "fungsi diblokir: " . (ini_get('disable_functions') ?: '(tidak ada)') . "\n\n";
foreach ([$root => 'public_html', $home => 'home'] as $dir => $name) {
    $t = "$dir/.probe-" . bin2hex(random_bytes(3));
    $w = @file_put_contents($t, 'x') !== false;
    if ($w) { $r = @rename($t, "$t.r"); @unlink($r ? "$t.r" : $t); }
    echo str_pad("tulis di $name", 15) . ': ' . ok($w) . ($w ? ' (rename: ' . ok($r) . ')' : '') . "\n";
}
echo "\nbuat folder cms/ di home: ";
$d = "$home/cms-probe-" . bin2hex(random_bytes(3));
echo ok(@mkdir($d)) . "\n"; @rmdir($d);
echo "\nHAPUS file ini dari server setelah dibaca.\n";
