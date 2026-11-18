<?php
/** Pengelola konten ANSORUN. Satu file. Mesin ada di ../../cms/lib/cms.php (di luar folder publik). */
declare(strict_types=1);
require (getenv('CMS_DIR') ?: __DIR__ . '/../../cms') . '/lib/cms.php';

header('X-Robots-Tag: noindex'); header('X-Frame-Options: DENY'); header('Cache-Control: no-store');
cms_session();
$h = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
function back(): void { header('Location: ./'); exit; }

$SECTIONS = ['hero-poster' => 'Hero', 'tentang' => 'Tentang', 'highlight' => 'Event Highlights', 'race' => 'Race Information', 'info' => 'Info lomba',
    'rute' => 'Rute', 'hadiah' => 'Hadiah dan Racepack', 'langkah' => 'Cara bergabung', 'daftar' => 'Pendaftaran', 'faq' => 'FAQ', 'kontak' => 'Kontak',
    'header' => 'Menu', 'footer' => 'Footer', 'seo' => 'Judul dan deskripsi Google', 'page-banner' => 'Banner halaman', 'halaman' => 'Isi halaman'];

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
try { if (cms_sync($values)) $_SESSION['msg'] = 'Situs diperbarui ke versi ' . cms_version() . '.'; }
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

/* ---- tampilan */
$sections = [];
foreach ($fields as $k => $f) $sections[$f['section']][] = $k;
$msg = $_SESSION['msg'] ?? ''; $errors = $_SESSION['errors'] ?? []; unset($_SESSION['msg'], $_SESSION['errors']);
?><!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Konten</title>
<style>body{font:15px/1.5 system-ui;background:#f3f7f6;color:#10302f;margin:0}main{max-width:900px;margin:auto;padding:16px}header{background:#10302f;color:#fff;padding:12px 16px;display:flex;gap:16px}header a{color:#fff}header b{margin-right:auto}
details{background:#fff;border:1px solid #dbe5e3;border-radius:10px;margin:10px 0}summary{padding:12px 16px;font-weight:700;cursor:pointer}details>div{padding:0 16px 8px}.f{border-top:1px solid #dbe5e3;padding:10px 0}.f small{color:#5b7170;display:block}
input[type=text],input[type=datetime-local],textarea{width:100%;box-sizing:border-box;padding:8px;font:inherit;margin-top:4px}img{max-width:200px;max-height:110px;display:block;margin:6px 0;border:1px solid #dbe5e3}
.msg{padding:10px 14px;border-radius:8px;background:#e6f6ee;margin:10px 0}.err{background:#fdeceb;color:#b3261e}.bar{position:sticky;bottom:0;background:#fff;padding:10px 0;border-top:1px solid #dbe5e3}button{background:#027757;color:#fff;border:0;border-radius:99px;padding:10px 24px;font-weight:700;cursor:pointer}</style>
<header><b>ANSORUN — Pengelola Konten <small style="font-weight:400;opacity:.7">v<?= $h(cms_version() ?: '?') ?></small></b><a href="/" target="_blank">Lihat situs</a><a href="?keluar">Keluar (<?= $h($_SESSION['user']) ?>)</a></header><main>
<?php if ($msg) echo '<div class="msg">' . $h($msg) . '</div>'; foreach ($errors as $e) echo '<div class="msg err">' . $h($e) . '</div>'; ?>
<p>Ubah lalu klik <b>Simpan dan tayangkan</b> di bawah. Perubahan langsung tampil di situs. Teks panjang boleh memakai <code>**tebal**</code>, <code>*miring*</code>, <code>[teks](tautan)</code>.</p>
<form method="post" enctype="multipart/form-data"><input type="hidden" name="csrf" value="<?= $h(cms_csrf()) ?>">
<?php $first = true; foreach ($sections as $sec => $keys): ?>
<details<?= $first ? ' open' : '' ?>><summary><?= $h($SECTIONS[$sec] ?? ucfirst($sec)) ?> (<?= count($keys) ?>)</summary><div>
<?php $first = false; foreach ($keys as $k): $f = $fields[$k]; $over = $values[$k] ?? null; $cur = $over ?? ($f['type'] === 'datetime' ? $f['default'] : cms_plain($f)); ?>
<div class="f"><input type="hidden" name="has[<?= $h($k) ?>]" value="1"><b><?= $h($f['label']) ?></b><?= $over !== null ? ' <small>• sudah diubah</small>' : '' ?>
<?php if (count($f['pages']) > 1) echo '<small>Dipakai di ' . count($f['pages']) . ' halaman, berlaku di semuanya.</small>';
if ($f['type'] === 'image'): ?><img loading="lazy" src="<?= $h($over ?? $f['default']) ?>" alt=""><input type="file" name="up[<?= $h($k) ?>]" accept="image/*">
<?php if (!empty($f['width'])) echo '<small>Ukuran asli ' . (int)$f['width'] . '×' . (int)$f['height'] . ' px, pakai rasio yang sama.</small>'; ?>
<?php elseif ($f['type'] === 'datetime'): ?><input type="datetime-local" name="f[<?= $h($k) ?>]" value="<?= $h(substr($cur, 0, 16)) ?>">
<?php elseif ($f['type'] === 'html' || strlen($cur) > 90 || str_contains($cur, "\n")): ?><textarea name="f[<?= $h($k) ?>]" rows="<?= min(10, 2 + intdiv(strlen($cur), 90) + substr_count($cur, "\n")) ?>"><?= $h($cur) ?></textarea>
<?php else: ?><input type="text" name="f[<?= $h($k) ?>]" value="<?= $h($cur) ?>"><?php endif;
if ($over !== null) echo '<label><input type="checkbox" name="reset[' . $h($k) . ']" value="1"> Kembalikan ke bawaan</label>'; ?></div>
<?php endforeach; ?></div></details>
<?php endforeach; ?>
<div class="bar"><button>Simpan dan tayangkan</button></div></form></main>
