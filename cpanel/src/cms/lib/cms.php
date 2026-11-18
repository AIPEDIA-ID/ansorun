<?php
/**
 * Mesin CMS, sengaja kecil: templat (tpl/) + nilai klien (content/content.json) -> HTML statis di public_html.
 * Tanpa database. Nilai yang belum diedit memakai teks bawaan dari templat (fallback).
 */
declare(strict_types=1);

function cms_dir(): string { return dirname(__DIR__); }
function cms_public(): string {
    $cfg = cms_config();
    return rtrim($cfg['public_html'] ?? ($_SERVER['DOCUMENT_ROOT'] ?? dirname(cms_dir()) . '/public_html'), '/');
}
function cms_config(): array { return is_file(cms_dir() . '/config.php') ? (require cms_dir() . '/config.php') : []; }

function cms_read(string $file): array {
    $j = is_file($file) ? json_decode((string)file_get_contents($file), true) : null;
    return is_array($j) ? $j : [];
}

/** Tulis lewat file sementara lalu rename: tidak pernah ada file setengah jadi. */
function cms_write(string $path, string $data): void {
    if (!is_dir(dirname($path))) mkdir(dirname($path), 0755, true);
    $tmp = $path . '.tmp' . bin2hex(random_bytes(3));
    if (file_put_contents($tmp, $data, LOCK_EX) === false || !rename($tmp, $path)) throw new RuntimeException("Gagal menulis $path");
}

function cms_manifest(): array { return cms_read(cms_dir() . '/tpl/manifest.json') + ['templates' => [], 'fields' => []]; }
function cms_values(): array { return cms_read(cms_dir() . '/content/content.json')['values'] ?? []; }

/* ---------------------------------------------------------------- nilai -> HTML */

function cms_esc(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

function cms_url(string $u): string {
    $u = trim($u);
    return preg_match('~^(https?://|mailto:|tel:|/|#)~i', $u) || $u === '' ? $u : 'https://' . $u;
}

/** Format klien -> HTML aman: **tebal**, *miring*, [teks](tautan), baris baru. */
function cms_rich(string $v): string {
    $s = cms_esc(str_replace("\r", '', $v));
    $s = preg_replace('/\*\*(.+?)\*\*/s', '<strong>$1</strong>', $s);
    $s = preg_replace('/(?<![*\w])\*(?!\s)(.+?)(?<!\s)\*(?![*\w])/s', '<em>$1</em>', $s);
    $s = preg_replace_callback('/\[([^\]]+)\]\(([^)\s]+)\)/', fn($m) => '<a href="' . cms_esc(cms_url(html_entity_decode($m[2]))) . '">' . $m[1] . '</a>', $s);
    return str_replace("\n", '<br>', $s);
}

/** Teks bawaan (HTML dari templat) -> teks polos untuk formulir. */
function cms_plain(array $f): string {
    $h = $f['default'];
    if ($f['type'] === 'html') {
        $h = preg_replace(['~<br\s*/?>~i', '~<(strong|b)\b[^>]*>(.*?)</\1>~is', '~<(em|i)\b[^>]*>(.*?)</\1>~is'], ["\n", '**$2**', '*$2*'], $h);
        $h = preg_replace_callback('~<a\b[^>]*href="([^"]*)"[^>]*>(.*?)</a>~is', fn($m) => '[' . strip_tags($m[2]) . '](' . html_entity_decode($m[1]) . ')', $h);
    }
    return trim(html_entity_decode(strip_tags($h), ENT_QUOTES, 'UTF-8'));
}

function cms_field(array $f, ?string $v): string {
    if ($v === null) return $f['default']; // fallback: persis seperti build Astro
    return match ($f['type']) {
        'html' => cms_rich($v),
        'url' => cms_esc(cms_url($v)),
        'datetime' => preg_match('/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d([+-]\d\d:\d\d|Z)$/', $v) ? cms_esc($v) : $f['default'],
        default => cms_esc($v),
    };
}

/** @return array<string,string> halaman => HTML */
function cms_render_all(array $values): array {
    $m = cms_manifest();
    $out = [];
    foreach ($m['templates'] as $rel) {
        $out[$rel] = preg_replace_callback('/%%CMS:([A-Za-z0-9_]+)%%/', function ($x) use ($m, $values) {
            $f = $m['fields'][$x[1]] ?? null;
            return $f ? cms_field($f, isset($values[$x[1]]) ? (string)$values[$x[1]] : null) : '';
        }, (string)file_get_contents(cms_dir() . '/tpl/' . $rel));
    }
    return $out;
}

function cms_version(): string { return trim((string)@file_get_contents(cms_dir() . '/VERSION')); }

/** Tulis ulang semua halaman dari templat + nilai klien. Gagal render = tidak ada yang ditulis. */
function cms_publish(array $values): int {
    $pages = cms_render_all($values); // render dulu semuanya; bila error, situs lama utuh
    foreach ($pages as $rel => $html) cms_write(cms_public() . '/' . $rel, $html);
    cms_write(cms_dir() . '/state/rendered', sha1($pages['index.html'] ?? ''));
    return count($pages);
}

/** Setelah Extract zip: bila index.html bukan buatan CMS lagi (tertimpa hasil build), terapkan lagi suntingan klien. */
function cms_sync(array $values): bool {
    $idx = cms_public() . '/index.html';
    if (is_file($idx) && sha1_file($idx) === trim((string)@file_get_contents(cms_dir() . '/state/rendered'))) return false;
    cms_publish($values);
    return true;
}

/** Simpan konten klien (dengan salinan versi lama), lalu tayangkan. */
function cms_save(array $values): int {
    $pages = cms_render_all($values); // uji render dulu, sebelum menyentuh apa pun
    $file = cms_dir() . '/content/content.json';
    if (is_file($file)) {
        @mkdir(cms_dir() . '/content/history', 0755, true);
        copy($file, cms_dir() . '/content/history/' . date('Ymd-His') . '.json');
    }
    cms_write($file, json_encode(['values' => $values], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    return cms_publish($values);
}

/* ---------------------------------------------------------------- gambar */

/** @return string URL (relatif situs) atau pesan galat diawali "!" */
function cms_upload(array $file, array $field, string $base): string {
    if (($file['error'] ?? 1) !== UPLOAD_ERR_OK || $file['size'] > 6 * 1048576) return '!Unggahan gagal atau lebih dari 6 MB.';
    $info = @getimagesize($file['tmp_name']);
    $ext = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp', IMAGETYPE_GIF => 'gif'][$info[2] ?? 0] ?? null;
    if (!$ext) return '!Hanya gambar JPG, PNG, WebP, atau GIF.';
    if (!empty($field['width']) && !empty($field['height']) && abs(($info[0] / $info[1]) / ($field['width'] / $field['height']) - 1) > 0.06) {
        return "!Rasio gambar tidak cocok. Dibutuhkan sekitar {$field['width']}×{$field['height']}, yang diunggah {$info[0]}×{$info[1]}.";
    }
    $dir = cms_public() . '/uploads';
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    if (!is_file("$dir/.htaccess")) file_put_contents("$dir/.htaccess", "RemoveHandler .php .phtml\n<FilesMatch \"\\.(php|phtml|phar)$\">\n  Require all denied\n</FilesMatch>\n");
    $name = date('Ymd') . '-' . bin2hex(random_bytes(4)) . ".$ext";
    return move_uploaded_file($file['tmp_name'], "$dir/$name") ? "$base/uploads/$name" : '!Gagal menyimpan gambar.';
}

/* ---------------------------------------------------------------- login */

function cms_session(): void {
    session_name('cmsid');
    session_set_cookie_params(['path' => '/', 'secure' => !empty($_SERVER['HTTPS']), 'httponly' => true, 'samesite' => 'Strict']);
    @mkdir(cms_dir() . '/state', 0755, true);
    session_save_path(cms_dir() . '/state');
    session_start();
}
function cms_csrf(): string { return $_SESSION['csrf'] ??= bin2hex(random_bytes(16)); }
function cms_csrf_ok(): bool { return hash_equals($_SESSION['csrf'] ?? '', (string)($_POST['csrf'] ?? '')); }
function cms_login(string $u, string $p): bool {
    $hash = cms_config()['users'][$u] ?? '$2y$10$abcdefghijklmnopqrstuuYB1FNBy9xfkJjuQ0Kg0u8W6vK8fTq2'; // verifikasi tetap jalan: waktu respons sama
    return password_verify($p, $hash) && isset(cms_config()['users'][$u]);
}
