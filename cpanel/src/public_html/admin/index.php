<?php
/** ANSORUN CMS admin. Single file. The engine lives in ../../cms/lib/cms.php, outside the public folder. */
declare(strict_types=1);
require (getenv('CMS_DIR') ?: __DIR__ . '/../../cms') . '/lib/cms.php';

header('X-Robots-Tag: noindex'); header('X-Frame-Options: DENY'); header('Cache-Control: no-store');
cms_session();
$h = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
/* Absolute redirect to the admin folder. A relative './' would resolve to the site root when the URL has no trailing slash. */
function back(): void { $p = (string)($_GET['p'] ?? ''); $dir = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/') . '/'; header('Location: ' . $dir . ($p !== '' ? '?p=' . rawurlencode($p) : '')); exit; }

/* Keys are the first CSS class of each template section (see sectionLabel in scripts/cms-build.mjs). If you rename a class, update its label here too. */
$SECTIONS = ['hero-poster' => 'Hero', 'tentang' => 'About', 'highlight' => 'Event highlights', 'race' => 'Race information', 'info' => 'Race info',
    'rute' => 'Route', 'hadiah' => 'Prizes & racepack', 'langkah' => 'How to join', 'daftar' => 'Registration', 'faq' => 'FAQ', 'kontak' => 'Contact',
    'header' => 'Menu', 'footer' => 'Footer', 'seo' => 'Page title & description (SEO)', 'page-banner' => 'Page banner', 'halaman' => 'Page content',
    'hero-countdown' => 'Countdown', 'pb-14' => 'Countdown', 'video' => 'Video', 'section' => 'Images & other'];

/* Shared Tailwind classes for the login and admin pages. */
$F = 'mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-lime';
$B = 'inline-flex cursor-pointer items-center justify-center rounded-full bg-brand px-6 py-2.5 font-bold text-white hover:bg-brand/90';
$BTN_SMALL = 'rounded-full px-3 py-1 text-sm font-semibold text-brand hover:bg-brand/10';

function esc(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

/** One row in the Racepack items list. data-f = column name; input names are rebuilt by JS to match row order. */
function list_row(array $it, string $fallbackSrc): void {
    global $F, $BTN_SMALL;
    $img = (string)($it['image'] ?? '');
    ?>
    <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-line" data-row>
      <div class="flex flex-wrap gap-5">
        <div class="grid w-40 shrink-0 content-start gap-2">
          <img src="<?= esc($img !== '' ? $img : $fallbackSrc) ?>" alt="" class="h-24 w-40 rounded-lg border border-line bg-white object-contain">
          <input type="file" data-f="file" accept="image/*" class="text-sm file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-brand/10 file:px-3 file:py-1.5 file:font-semibold file:text-brand">
          <span class="text-sm text-soft"><?= $img !== '' ? 'Photo' : 'No photo: shows "Coming soon"' ?></span>
          <input type="hidden" data-f="image" value="<?= esc($img) ?>">
          <input type="hidden" data-f="w" value="<?= esc((string)($it['w'] ?? '')) ?>">
          <input type="hidden" data-f="h" value="<?= esc((string)($it['h'] ?? '')) ?>">
        </div>
        <div class="grid min-w-0 flex-1 gap-3">
          <label class="block text-sm font-semibold">Title<input type="text" data-f="title" value="<?= esc((string)($it['title'] ?? '')) ?>" class="<?= $F ?>"></label>
          <label class="block text-sm font-semibold">Description<input type="text" data-f="description" value="<?= esc((string)($it['description'] ?? '')) ?>" class="<?= $F ?>"></label>
          <label class="block text-sm font-semibold">Photo alt text<input type="text" data-f="alt" value="<?= esc((string)($it['alt'] ?? '')) ?>" class="<?= $F ?>"></label>
          <label class="block text-sm font-semibold">Emoji<input type="text" data-f="emoji" value="<?= esc((string)($it['emoji'] ?? '')) ?>" class="<?= $F ?> max-w-[8rem]"></label>
        </div>
        <div class="flex shrink-0 flex-col items-start gap-1">
          <button type="button" data-act="up" class="<?= $BTN_SMALL ?>">Up</button>
          <button type="button" data-act="down" class="<?= $BTN_SMALL ?>">Down</button>
          <button type="button" data-act="del" class="rounded-full px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-50">Remove</button>
        </div>
      </div>
    </div>
    <?php
}

/** Document head: Tailwind loads from a CDN pinned to the project's version, and the ANSORUN palette is registered as theme tokens. */
function admin_head(string $title): void { ?>
<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title><?= $title ?></title>
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.3.5/dist/index.global.js"></script>
<style type="text/tailwindcss">@theme{--color-ink:#10302f;--color-brand:#027757;--color-lime:#dfff40;--color-mist:#eef4f2;--color-line:#d6e3e0;--color-soft:#5b7170}</style>
<?php }

/* ---- login / logout */
if (isset($_GET['keluar'])) { session_destroy(); back(); }
if (empty($_SESSION['user'])) {
    $err = '';
    if ($_POST) {
        if (cms_csrf_ok() && cms_login(trim($_POST['u'] ?? ''), $_POST['p'] ?? '')) { session_regenerate_id(true); $_SESSION['user'] = $_POST['u']; back(); }
        $err = 'Wrong username or password.';
    }
    admin_head('Log in — CMS');
    ?>
<body class="grid min-h-screen place-items-center bg-mist p-4 font-sans text-[15px] text-ink">
<form method="post" class="w-full max-w-sm rounded-2xl bg-white p-7 shadow-sm ring-1 ring-line">
  <div class="mb-6"><div class="text-lg font-extrabold tracking-wider">ANSORUN</div><div class="text-sm text-soft">CMS</div></div>
  <?php if ($err): ?><div class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700"><?= $h($err) ?></div><?php endif; ?>
  <input type="hidden" name="csrf" value="<?= $h(cms_csrf()) ?>">
  <label class="mb-4 block text-sm font-semibold">Username<input name="u" autofocus required class="<?= $F ?>"></label>
  <label class="mb-6 block text-sm font-semibold">Password<input name="p" type="password" required class="<?= $F ?>"></label>
  <button class="<?= $B ?> w-full">Log in</button>
</form>
</body></html>
<?php exit;
}

$m = cms_manifest();
$fields = $m['fields'];
$base = rtrim((string)($m['base'] ?? '/'), '/');
$values = cms_values();
try { if (cms_sync($values)) $_SESSION['msg'] = 'Changes applied to the site (version ' . cms_version() . ').'; }
catch (Throwable $e) { $_SESSION['msg'] = 'Failed to apply new version: ' . $e->getMessage(); }

/* ---- save = publish immediately */
if ($_POST) {
    if (!cms_csrf_ok()) { $_SESSION['msg'] = 'Session expired. Please try again.'; back(); }
    $errors = [];
    /* Repeated lists (Racepack items): posted as list[NAME][i][column], images as listup[NAME][i] */
    foreach ($m['lists'] ?? [] as $name => $L) {
        if (empty($_POST['list_submitted'][$name]) && empty($_POST['list_reset'][$name])) continue;
        if (!empty($_POST['list_reset'][$name])) { unset($values['lists'][$name]); continue; }
        $items = [];
        foreach ($_POST['list'][$name] ?? [] as $i => $r) {
            $title = trim(str_replace("\r", '', (string)($r['title'] ?? '')));
            if ($title === '') continue; // rows without a title are dropped
            $img = trim((string)($r['image'] ?? '')); $w = (int)($r['w'] ?? 0); $h = (int)($r['h'] ?? 0);
            $err = $_FILES['listup']['error'][$name][$i] ?? UPLOAD_ERR_NO_FILE;
            if ($err === UPLOAD_ERR_OK) {
                $tmp = $_FILES['listup']['tmp_name'][$name][$i];
                $info = @getimagesize($tmp) ?: [0, 0];
                $r2 = cms_upload(['error' => $err, 'size' => $_FILES['listup']['size'][$name][$i], 'tmp_name' => $tmp], [], $base);
                if ($r2[0] === '!') { $errors[] = "$title: " . substr($r2, 1); } else { $img = $r2; $w = (int)$info[0]; $h = (int)$info[1]; }
            }
            $items[] = [
                'title' => $title,
                'description' => trim(str_replace("\r", '', (string)($r['description'] ?? ''))),
                'image' => $img,
                'w' => $img !== '' ? $w : null,
                'h' => $img !== '' ? $h : null,
                'alt' => trim((string)($r['alt'] ?? '')),
                'emoji' => trim((string)($r['emoji'] ?? '')) ?: '🎁',
            ];
        }
        $values['lists'][$name] = $items;
    }
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
        if ($v === '' || mb_strlen($v) > 6000) { $errors[] = $f['label'] . ': is empty or too long.'; continue; }
        if ($v === ($f['type'] === 'datetime' ? $f['default'] : cms_plain($f))) unset($values[$k]); else $values[$k] = $v;
    }
    try { $n = cms_save($values); $_SESSION['msg'] = "Saved and published ($n pages)."; }
    catch (Throwable $e) { $_SESSION['msg'] = 'Save failed. The live site is unchanged: ' . $e->getMessage(); }
    $_SESSION['errors'] = $errors;
    back();
}

/* ---- layout: sidebar tabs per page */
$PAGE_NAMES = ['index.html' => 'Home', 'racepack/index.html' => 'Racepack', 'lists' => 'Racepack items'];
$PAGE_URLS = ['index.html' => '/', 'racepack/index.html' => '/racepack/', 'galeri/index.html' => '/galeri/', '404.html' => '/404.html'];
$count = [];
foreach ($m['pages'] as $keys) foreach ($keys as $k) $count[$k] = ($count[$k] ?? 0) + 1;
$tabs = [];
$umum = [];
foreach ($m['pages'] as $rel => $keys) {
    foreach ($keys as $k) { if ($count[$k] > 1) $umum[$k] = $k; else $tabs[$rel][] = $k; }
}
$tabs = array_filter($tabs) + ($umum ? ['umum' => array_values($umum)] : []);
// Only these tabs: Home, Racepack, Racepack items (repeated list), Menu/footer/buttons
$tabs = array_merge(array_intersect_key($tabs, ['index.html' => 1, 'racepack/index.html' => 1]), ['lists' => ['racepack']], array_intersect_key($tabs, ['umum' => 1]));
$listCount = count($values['lists']['racepack'] ?? ($m['lists']['racepack']['items'] ?? []));
$cur = isset($tabs[$_GET['p'] ?? '']) ? $_GET['p'] : (string)array_key_first($tabs);
$tabName = fn($t) => $t === 'umum' ? 'Menu, footer, buttons' : ($PAGE_NAMES[$t] ?? $t);
$sections = [];
foreach ($tabs[$cur] ?? [] as $k) if (isset($fields[$k])) $sections[$fields[$k]['section']][] = $k;
$msg = $_SESSION['msg'] ?? ''; $errors = $_SESSION['errors'] ?? []; unset($_SESSION['msg'], $_SESSION['errors']);

admin_head($h($tabName($cur)) . ' — CMS');
?>
<body class="min-h-screen bg-mist font-sans text-[15px] leading-relaxed text-ink">
<aside class="bg-ink p-4 text-white md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col md:overflow-y-auto">
  <div class="px-2 pb-4 pt-1"><div class="text-[17px] font-extrabold tracking-wider">ANSORUN</div><div class="text-xs text-white/60">CMS · v<?= $h(cms_version() ?: '?') ?></div></div>
  <nav class="flex flex-wrap gap-1 md:flex-col">
    <?php foreach ($tabs as $t => $keys): if ($t === 'umum') echo '<hr class="my-3 hidden border-white/15 md:block">'; ?>
    <a href="?p=<?= $h(rawurlencode((string)$t)) ?>" class="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm <?= $t === $cur ? 'bg-lime font-bold text-ink' : 'text-white/85 hover:bg-white/10' ?>"><?= $h($tabName($t)) ?><span class="text-xs <?= $t === $cur ? 'opacity-70' : 'opacity-60' ?>"><?= $t === 'lists' ? $listCount : count($keys) ?></span></a>
    <?php endforeach; ?>
  </nav>
  <div class="mt-3 border-t border-white/15 px-2 pt-3 text-sm md:mt-auto"><?= $h($_SESSION['user']) ?> · <a href="?keluar" class="font-semibold text-lime">Log out</a><br><a href="/" target="_blank" class="font-semibold text-lime">View site ↗</a></div>
</aside>

<main class="p-4 pb-32 md:ml-64 md:p-8 md:pb-32">
<div class="max-w-3xl">
  <h1 class="text-2xl font-extrabold"><?= $h($tabName($cur)) ?></h1>
  <p class="mt-1 text-soft"><?= isset($PAGE_URLS[$cur]) ? '<a href="' . $h($PAGE_URLS[$cur]) . '" target="_blank" class="font-semibold text-brand underline-offset-2 hover:underline">View page ↗</a> · ' : '' ?>Edit, then click <b class="text-ink">Save &amp; publish</b>. Long text supports <code class="rounded bg-line/60 px-1.5 py-0.5 text-[13px]">**bold**</code>, <code class="rounded bg-line/60 px-1.5 py-0.5 text-[13px]">*italic*</code>, <code class="rounded bg-line/60 px-1.5 py-0.5 text-[13px]">[text](link)</code>.</p>
  <?php if ($cur !== 'lists'): ?>
  <div class="mt-3 flex gap-1">
    <button type="button" class="rounded-full px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand/10" onclick="document.querySelectorAll('details').forEach(d=>d.open=true)">Expand all</button>
    <button type="button" class="rounded-full px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand/10" onclick="document.querySelectorAll('details').forEach(d=>d.open=false)">Collapse all</button>
  </div>
  <?php endif; ?>

  <?php if ($msg): ?><div class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900"><?= $h($msg) ?></div><?php endif; ?>
  <?php foreach ($errors as $e): ?><div class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700"><?= $h($e) ?></div><?php endforeach; ?>

  <?php if ($cur === 'lists'):
    $name = 'racepack';
    $L = $m['lists'][$name] ?? ['items' => [], 'fallback' => ['src' => '', 'alt' => '']];
    $rows = $values['lists'][$name] ?? $L['items'];
  ?>
  <form method="post" action="?p=lists" enctype="multipart/form-data" id="listform" class="mt-4">
    <input type="hidden" name="csrf" value="<?= $h(cms_csrf()) ?>">
    <input type="hidden" name="list_submitted[racepack]" value="1">
    <p class="text-sm text-soft">One row per item, in display order. Items with a photo appear as cards on Home. Items without a photo are listed as "Coming soon" in the picker. Rows without a title are dropped on save.</p>
    <div id="rows" class="mt-4 grid gap-3">
      <?php foreach ($rows as $it) list_row($it, (string)($L['fallback']['src'] ?? '')); ?>
    </div>
    <template id="row-tpl"><?php list_row(['emoji' => '🎁'], (string)($L['fallback']['src'] ?? '')); ?></template>
    <div class="mt-4 flex flex-wrap items-center gap-4">
      <button type="button" id="add" class="<?= $BTN_SMALL ?>">+ Add item</button>
      <label class="inline-flex items-center gap-2 text-sm text-soft"><input type="checkbox" name="list_reset[racepack]" value="1" class="size-4 accent-brand"> Reset to default</label>
    </div>
    <div class="fixed inset-x-0 bottom-0 z-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line bg-white/90 px-4 py-3 backdrop-blur md:left-64 md:px-8">
      <button class="<?= $B ?>">Save &amp; publish</button>
      <span class="hidden text-sm text-soft sm:inline">Changes go live immediately.</span>
    </div>
  </form>
  <script>
    (() => {
      const rows = document.getElementById('rows');
      const tpl = document.getElementById('row-tpl');
      const form = document.getElementById('listform');
      // input names = current row order (called after every row change and before submit)
      const reindex = () => [...rows.querySelectorAll('[data-row]')].forEach((row, i) =>
        row.querySelectorAll('[data-f]').forEach((el) => {
          el.name = el.dataset.f === 'file' ? `listup[racepack][${i}]` : `list[racepack][${i}][${el.dataset.f}]`;
        }));
      rows.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-act]');
        if (!b) return;
        const row = b.closest('[data-row]');
        if (b.dataset.act === 'up' && row.previousElementSibling) rows.insertBefore(row, row.previousElementSibling);
        if (b.dataset.act === 'down' && row.nextElementSibling) rows.insertBefore(row.nextElementSibling, row);
        if (b.dataset.act === 'del' && confirm('Remove this item?')) row.remove();
        reindex();
      });
      document.getElementById('add').addEventListener('click', () => {
        rows.appendChild(tpl.content.firstElementChild.cloneNode(true));
        reindex();
      });
      form.addEventListener('submit', reindex);
      reindex();
    })();
  </script>
  <?php else: ?>
  <form method="post" action="?p=<?= $h(rawurlencode((string)$cur)) ?>" enctype="multipart/form-data">
  <input type="hidden" name="csrf" value="<?= $h(cms_csrf()) ?>">
  <?php $first = true; foreach ($sections as $sec => $keys): ?>
  <details class="group mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line"<?= $first ? ' open' : '' ?>>
    <summary class="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-bold hover:bg-mist/70 [&::-webkit-details-marker]:hidden">
      <span><?= $h($SECTIONS[$sec] ?? ucfirst($sec)) ?></span>
      <span class="flex shrink-0 items-center gap-2 text-sm font-normal text-soft"><?= count($keys) ?> fields
        <svg class="size-4 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/></svg>
      </span>
    </summary>
    <div class="divide-y divide-line border-t border-line px-5">
    <?php $first = false; foreach ($keys as $k): $f = $fields[$k]; $over = $values[$k] ?? null; $val = $over ?? ($f['type'] === 'datetime' ? $f['default'] : cms_plain($f)); ?>
      <div class="py-4">
        <input type="hidden" name="has[<?= $h($k) ?>]" value="1">
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span class="font-semibold"><?= $h(!empty($f['alt']) || str_starts_with($f['label'], 'Teks alternatif') ? 'Alt text' : ($f['type'] === 'image' || str_starts_with($f['label'], 'Gambar') ? 'Image' : $f['label'])) ?></span>
          <?php if ($over !== null): ?><span class="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">modified</span><?php endif; ?>
        </div>
        <?php if (count($f['pages']) > 1): ?><p class="text-sm text-soft">Used on <?= count($f['pages']) ?> pages.</p><?php endif; ?>

        <?php if ($f['type'] === 'image'): ?>
          <div class="mt-3 flex flex-wrap items-center gap-4">
            <img loading="lazy" src="<?= $h($over ?? $f['default']) ?>" alt="" class="h-24 w-40 rounded-lg border border-line bg-white object-contain">
            <div class="grid gap-1.5">
              <input type="file" name="up[<?= $h($k) ?>]" accept="image/*" class="text-sm file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:font-semibold file:text-brand hover:file:bg-brand/20">
              <?php if (!empty($f['width'])): ?><p class="text-sm text-soft"><?= (int)$f['width'] ?>×<?= (int)$f['height'] ?> px</p><?php endif; ?>
            </div>
          </div>
        <?php elseif ($f['type'] === 'datetime'): ?>
          <input type="datetime-local" name="f[<?= $h($k) ?>]" value="<?= $h(substr($val, 0, 16)) ?>" class="<?= $F ?> max-w-xs">
        <?php elseif ($f['type'] === 'html' || strlen($val) > 90 || str_contains($val, "\n")): ?>
          <textarea name="f[<?= $h($k) ?>]" rows="<?= min(10, 2 + intdiv(strlen($val), 90) + substr_count($val, "\n")) ?>" class="<?= $F ?> resize-y leading-relaxed"><?= $h($val) ?></textarea>
        <?php else: ?>
          <input type="text" name="f[<?= $h($k) ?>]" value="<?= $h($val) ?>" class="<?= $F ?>">
        <?php endif; ?>

        <?php if ($over !== null): ?>
          <label class="mt-2 inline-flex items-center gap-2 text-sm text-soft"><input type="checkbox" name="reset[<?= $h($k) ?>]" value="1" class="size-4 accent-brand"> Reset to default</label>
        <?php endif; ?>
      </div>
    <?php endforeach; ?>
    </div>
  </details>
  <?php endforeach; ?>

  <div class="fixed inset-x-0 bottom-0 z-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line bg-white/90 px-4 py-3 backdrop-blur md:left-64 md:px-8">
    <button class="<?= $B ?>">Save &amp; publish</button>
    <span class="hidden text-sm text-soft sm:inline">Changes go live immediately.</span>
  </div>
  </form>
  <?php endif; ?>
</div>
</main>
</body></html>
