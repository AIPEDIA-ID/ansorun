<?php
/** Pengelola konten ANSORUN. Satu file. Mesin ada di ../../cms/lib/cms.php (di luar folder publik). */
declare(strict_types=1);
require (getenv('CMS_DIR') ?: __DIR__ . '/../../cms') . '/lib/cms.php';

header('X-Robots-Tag: noindex'); header('X-Frame-Options: DENY'); header('Cache-Control: no-store');
cms_session();
$h = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
function back(): void { $p = (string)($_GET['p'] ?? ''); header('Location: ./' . ($p !== '' ? '?p=' . rawurlencode($p) : '')); exit; }

$SECTIONS = ['hero-poster' => 'Hero', 'tentang' => 'Tentang', 'highlight' => 'Event Highlights', 'race' => 'Race Information', 'info' => 'Info lomba',
    'rute' => 'Rute', 'hadiah' => 'Hadiah dan Racepack', 'langkah' => 'Cara bergabung', 'daftar' => 'Pendaftaran', 'faq' => 'FAQ', 'kontak' => 'Kontak',
    'header' => 'Menu', 'footer' => 'Footer', 'seo' => 'Judul dan deskripsi Google', 'page-banner' => 'Banner halaman', 'halaman' => 'Isi halaman',
    'pb-14' => 'Hitung mundur', 'video' => 'Video', 'section' => 'Foto dan bagian lain'];

/* ---- login / keluar */
if (isset($_GET['keluar'])) { session_destroy(); back(); }
if (empty($_SESSION['user'])) {
    $err = '';
    if ($_POST) {
        if (cms_csrf_ok() && cms_login(trim($_POST['u'] ?? ''), $_POST['p'] ?? '')) { session_regenerate_id(true); $_SESSION['user'] = $_POST['u']; back(); }
        $err = 'Nama pengguna atau kata sandi salah.';
    }
    echo '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Masuk</title><style>body{font:16px system-ui;background:#f3f7f6;display:grid;place-items:center;min-height:100vh;margin:0}form{background:#fff;padding:24px;border-radius:12px;width:320px}input{width:100%;padding:9px;margin:4px 0 12px;box-sizing:border-box}button{background:#dfff40;border:0;border-radius:99px;padding:10px 22px;font-weight:700}</style>';
    echo '<form method="post"><h2>Pengelola Konten</h2>' . ($err ? "<p style='color:#b3261e'>$err</p>" : '') . '<input type="hidden" name="csrf" value="' . $h(cms_csrf()) . '">';
    echo 'Nama pengguna<input name="u" autofocus required>Kata sandi<input name="p" type="password" required><button>Masuk</button></form>';
    exit;
}

$m = cms_manifest();
$fields = $m['fields'];
$base = rtrim((string)($m['base'] ?? '/'), '/');
$values = cms_values();
try { if (cms_sync($values)) $_SESSION['msg'] = 'Suntingan klien diterapkan ke situs (versi ' . cms_version() . ').'; }
catch (Throwable $e) { $_SESSION['msg'] = 'Gagal menerapkan versi baru: ' . $e->getMessage(); }

/* ---- simpan = langsung tayang */
if ($_POST) {
    if (!cms_csrf_ok()) { $_SESSION['msg'] = 'Sesi habis, coba lagi.'; back(); }
    $errors = [];
    foreach ($fields as $k => $f) {
        if (!isset($_POST['has'][$k])) continue;
        if (!empty($_POST['reset'][$k])) { unset($values[$k]); continue; }
        if ($f['type'] === 'image') {
            if (empty($_FILES['up']['name'][$k])) continue;
            $r = cms_upload(array_map(fn($a) => $a[$k], $_FILES['up']), $f, $base);
            if ($r[0] === '!') $errors[] = $f['label'] . ': ' . substr($r, 1); else $values[$k] = $r;
            continue;
        }
        $v = trim(str_replace("\r", '', (string)($_POST['f'][$k] ?? '')));
        if ($f['type'] === 'datetime') {
            $off = preg_match('/([+-]\d\d:\d\d|Z)$/', $f['default'], $o) ? $o[1] : '+07:00';
            $v = preg_match('/^\d{4}-\d\d-\d\dT\d\d:\d\d$/', $v) ? "$v:00$off" : $f['default'];
        } elseif ($f['type'] !== 'html' && !str_contains($f['default'], "\n")) { $v = preg_replace('/\s*\n\s*/', ' ', $v); }
        if ($v === '' || mb_strlen($v) > 6000) { $errors[] = $f['label'] . ': kosong atau terlalu panjang.'; continue; }
        if ($v === ($f['type'] === 'datetime' ? $f['default'] : cms_plain($f))) unset($values[$k]); else $values[$k] = $v;
    }
    try { $n = cms_save($values); $_SESSION['msg'] = "Tersimpan dan tayang ($n halaman)."; }
    catch (Throwable $e) { $_SESSION['msg'] = 'Gagal, situs lama tetap tayang: ' . $e->getMessage(); }
    $_SESSION['errors'] = $errors;
    back();
}

/* ---- tampilan: menu samping per halaman */
$PAGE_NAMES = ['index.html' => 'Beranda', 'racepack/index.html' => 'Racepack', 'galeri/index.html' => 'Galeri', '404.html' => 'Halaman 404'];
$PAGE_URLS = ['index.html' => '/', 'racepack/index.html' => '/racepack/', 'galeri/index.html' => '/galeri/', '404.html' => '/404.html'];
$count = [];
foreach ($m['pages'] as $keys) foreach ($keys as $k) $count[$k] = ($count[$k] ?? 0) + 1;
$tabs = [];
$umum = [];
foreach ($m['pages'] as $rel => $keys) {
    foreach ($keys as $k) { if ($count[$k] > 1) $umum[$k] = $k; else $tabs[$rel][] = $k; }
}
$tabs = array_filter($tabs) + ($umum ? ['umum' => array_values($umum)] : []);
$cur = isset($tabs[$_GET['p'] ?? '']) ? $_GET['p'] : (string)array_key_first($tabs);
$tabName = fn($t) => $t === 'umum' ? 'Menu, footer, tombol' : ($PAGE_NAMES[$t] ?? $t);
$sections = [];
foreach ($tabs[$cur] ?? [] as $k) $sections[$fields[$k]['section']][] = $k;
$msg = $_SESSION['msg'] ?? ''; $errors = $_SESSION['errors'] ?? []; unset($_SESSION['msg'], $_SESSION['errors']);
?><!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title><?= $h($tabName($cur)) ?> — Pengelola Konten</title>
<style>
*{box-sizing:border-box}body{font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif;background:#eef4f2;color:#10302f;margin:0}
aside{position:fixed;inset:0 auto 0 0;width:250px;background:#10302f;color:#fff;display:flex;flex-direction:column;padding:18px 12px;overflow:auto}
aside .brand{font-weight:800;letter-spacing:.04em;padding:4px 10px 16px;font-size:17px}aside .brand small{display:block;font-weight:400;opacity:.6;font-size:12px;letter-spacing:0}
aside nav a{display:flex;justify-content:space-between;gap:8px;padding:10px 12px;border-radius:10px;color:#dce9e6;text-decoration:none;margin-bottom:2px}
aside nav a:hover{background:#1c4644}aside nav a.on{background:#dfff40;color:#10302f;font-weight:700}aside nav a span{opacity:.6;font-size:12px;font-weight:400}
aside nav hr{border:0;border-top:1px solid #ffffff22;margin:10px 0}aside .foot{margin-top:auto;padding:12px 10px 0;font-size:13px;border-top:1px solid #ffffff22}aside .foot a{color:#dfff40}
main{margin-left:250px;padding:24px 28px 90px;max-width:1010px}main h1{margin:0 0 4px;font-size:26px}main .sub{color:#5b7170;margin:0 0 16px}main .sub a{color:#027757}
details{background:#fff;border:1px solid #d6e3e0;border-radius:14px;margin:12px 0;overflow:hidden}summary{padding:14px 18px;font-weight:700;cursor:pointer;display:flex;justify-content:space-between}
summary span{font-weight:400;color:#5b7170;font-size:13px}details>div{padding:0 18px 6px}.f{border-top:1px solid #e3ecea;padding:14px 0}.f>b{display:block;margin-bottom:2px}.f small{color:#5b7170;display:block}.f .ch{color:#027757;font-weight:600}
input[type=text],input[type=datetime-local],textarea{width:100%;padding:9px 11px;font:inherit;margin-top:6px;border:1px solid #c9d8d5;border-radius:9px;background:#fbfdfc}textarea{resize:vertical}input:focus,textarea:focus{outline:2px solid #dfff40;border-color:#027757}
.img{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:6px}.img img{width:150px;height:90px;object-fit:contain;background:#f1f6f5;border:1px solid #d6e3e0;border-radius:9px}
.msg{padding:11px 15px;border-radius:10px;background:#e4f6ec;border:1px solid #b9e3cd;margin:0 0 12px}.msg.err{background:#fdeceb;border-color:#f3c0bc;color:#b3261e}
.bar{position:fixed;left:250px;right:0;bottom:0;background:#ffffffee;backdrop-filter:blur(6px);border-top:1px solid #d6e3e0;padding:12px 28px;display:flex;gap:12px;align-items:center}
button{background:#027757;color:#fff;border:0;border-radius:99px;padding:11px 26px;font:inherit;font-weight:700;cursor:pointer}button.ghost{background:none;color:#027757;padding:4px 8px;font-weight:600}
code{background:#e3ecea;padding:1px 5px;border-radius:5px}
@media(max-width:820px){aside{position:static;width:auto;flex-direction:row;flex-wrap:wrap;padding:10px}aside nav{display:flex;flex-wrap:wrap;gap:4px}aside nav hr,aside .foot{display:none}main{margin:0;padding:16px 14px 90px}.bar{left:0;padding:12px 14px}}
</style>
<aside><div class="brand">ANSORUN<small>Pengelola Konten · v<?= $h(cms_version() ?: '?') ?></small></div>
<nav><?php foreach ($tabs as $t => $keys): if ($t === 'umum') echo '<hr>'; ?><a class="<?= $t === $cur ? 'on' : '' ?>" href="?p=<?= $h(rawurlencode((string)$t)) ?>"><?= $h($tabName($t)) ?><span><?= count($keys) ?></span></a><?php endforeach; ?></nav>
<div class="foot"><?= $h($_SESSION['user']) ?> · <a href="?keluar">Keluar</a><br><a href="/" target="_blank">Lihat situs ↗</a></div></aside>
<main><h1><?= $h($tabName($cur)) ?></h1>
<p class="sub"><?= isset($PAGE_URLS[$cur]) ? '<a href="' . $h($PAGE_URLS[$cur]) . '" target="_blank">Lihat halaman ↗</a> · ' : '' ?>Ubah lalu klik <b>Simpan dan tayangkan</b>. Teks panjang boleh memakai <code>**tebal**</code>, <code>*miring*</code>, <code>[teks](tautan)</code>.
<button type="button" class="ghost" onclick="document.querySelectorAll('details').forEach(d=>d.open=true)">Buka semua</button><button type="button" class="ghost" onclick="document.querySelectorAll('details').forEach(d=>d.open=false)">Tutup semua</button></p>
<?php if ($msg) echo '<div class="msg">' . $h($msg) . '</div>'; foreach ($errors as $e) echo '<div class="msg err">' . $h($e) . '</div>'; ?>
<form method="post" action="?p=<?= $h(rawurlencode((string)$cur)) ?>" enctype="multipart/form-data"><input type="hidden" name="csrf" value="<?= $h(cms_csrf()) ?>">
<?php $first = true; foreach ($sections as $sec => $keys): ?>
<details<?= $first ? ' open' : '' ?>><summary><?= $h($SECTIONS[$sec] ?? ucfirst($sec)) ?><span><?= count($keys) ?> isian</span></summary><div>
<?php $first = false; foreach ($keys as $k): $f = $fields[$k]; $over = $values[$k] ?? null; $val = $over ?? ($f['type'] === 'datetime' ? $f['default'] : cms_plain($f)); ?>
<div class="f"><input type="hidden" name="has[<?= $h($k) ?>]" value="1"><b><?= $h($f['label']) ?></b><?= $over !== null ? '<small class="ch">sudah diubah</small>' : '' ?>
<?php if (count($f['pages']) > 1) echo '<small>Dipakai di ' . count($f['pages']) . ' halaman, berlaku di semuanya.</small>';
if ($f['type'] === 'image'): ?><div class="img"><img loading="lazy" src="<?= $h($over ?? $f['default']) ?>" alt=""><div><input type="file" name="up[<?= $h($k) ?>]" accept="image/*">
<?php if (!empty($f['width'])) echo '<small>Ukuran asli ' . (int)$f['width'] . '×' . (int)$f['height'] . ' px, pakai rasio yang sama.</small>'; ?></div></div>
<?php elseif ($f['type'] === 'datetime'): ?><input type="datetime-local" name="f[<?= $h($k) ?>]" value="<?= $h(substr($val, 0, 16)) ?>">
<?php elseif ($f['type'] === 'html' || strlen($val) > 90 || str_contains($val, "\n")): ?><textarea name="f[<?= $h($k) ?>]" rows="<?= min(10, 2 + intdiv(strlen($val), 90) + substr_count($val, "\n")) ?>"><?= $h($val) ?></textarea>
<?php else: ?><input type="text" name="f[<?= $h($k) ?>]" value="<?= $h($val) ?>"><?php endif;
if ($over !== null) echo '<label><input type="checkbox" name="reset[' . $h($k) . ']" value="1"> Kembalikan ke bawaan</label>'; ?></div>
<?php endforeach; ?></div></details>
<?php endforeach; ?>
<div class="bar"><button>Simpan dan tayangkan</button><small>Perubahan langsung tampil di situs.</small></div></form></main>
