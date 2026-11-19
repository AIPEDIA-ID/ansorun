<?php
/**
 * CMS engine. Deliberately small: templates (tpl/) + client values (public_html/data/content.json)
 * are rendered into static HTML in public_html. No database. Fields the client has not edited
 * fall back to the default text stored in the template.
 */
declare(strict_types=1);

/* ---------------------------------------------------------------- paths and config */

function cms_dir(): string { return dirname(__DIR__); }

function cms_public(): string {
    $cfg = cms_config();
    return rtrim($cfg['public_html'] ?? ($_SERVER['DOCUMENT_ROOT'] ?? dirname(cms_dir()) . '/public_html'), '/');
}

/** All client data lives in one folder: content.json, history/, uploads/. To move hosting, copy this folder. */
function cms_data(): string {
    $dir = rtrim(cms_config()['data_dir'] ?? cms_public() . '/data', '/');
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    // The data folder may be served for images, but not JSON or PHP. One .htaccess here is enough.
    if (!is_file("$dir/.htaccess")) file_put_contents("$dir/.htaccess", "Options -Indexes -ExecCGI\nRemoveHandler .php .phtml\n<FilesMatch \"\\.(json|php|phtml|phar)$\">\n  Require all denied\n</FilesMatch>\n");
    return $dir;
}

function cms_config(): array {
    return is_file(cms_dir() . '/config.php') ? (require cms_dir() . '/config.php') : [];
}

function cms_read(string $file): array {
    $json = is_file($file) ? json_decode((string)file_get_contents($file), true) : null;
    return is_array($json) ? $json : [];
}

/** Write to a temporary file, then rename it, so a half-written file never goes live. */
function cms_write(string $path, string $data): void {
    if (!is_dir(dirname($path))) mkdir(dirname($path), 0755, true);
    $tmp = $path . '.tmp' . bin2hex(random_bytes(3));
    if (file_put_contents($tmp, $data, LOCK_EX) === false || !rename($tmp, $path)) {
        throw new RuntimeException("Failed to write $path");
    }
}

function cms_manifest(): array {
    return cms_read(cms_dir() . '/tpl/manifest.json') + ['templates' => [], 'fields' => []];
}

function cms_values(): array {
    return cms_read(cms_data() . '/content.json')['values'] ?? [];
}

function cms_version(): string {
    return trim((string)@file_get_contents(cms_dir() . '/VERSION'));
}

/* ---------------------------------------------------------------- values to HTML */

function cms_esc(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Adds https:// to bare domains. Relative paths, anchors, and mailto/tel links are kept as they are. */
function cms_url(string $url): string {
    $url = trim($url);
    return preg_match('~^(https?://|mailto:|tel:|/|#)~i', $url) || $url === '' ? $url : 'https://' . $url;
}

/** Client text to safe HTML. Supports **bold**, *italic*, [text](link), and line breaks. */
function cms_rich(string $value): string {
    $html = cms_esc(str_replace("\r", '', $value));
    $html = preg_replace('/\*\*(.+?)\*\*/s', '<strong>$1</strong>', $html);
    $html = preg_replace('/(?<![*\w])\*(?!\s)(.+?)(?<!\s)\*(?![*\w])/s', '<em>$1</em>', $html);
    $html = preg_replace_callback(
        '/\[([^\]]+)\]\(([^)\s]+)\)/',
        fn($m) => '<a href="' . cms_esc(cms_url(html_entity_decode($m[2]))) . '">' . $m[1] . '</a>',
        $html
    );
    return str_replace("\n", '<br>', $html);
}

/** Default template HTML to plain text for the edit form. */
function cms_plain(array $field): string {
    $html = $field['default'];
    if ($field['type'] === 'html') {
        $html = preg_replace(
            ['~<br\s*/?>~i', '~<(strong|b)\b[^>]*>(.*?)</\1>~is', '~<(em|i)\b[^>]*>(.*?)</\1>~is'],
            ["\n", '**$2**', '*$2*'],
            $html
        );
        $html = preg_replace_callback(
            '~<a\b[^>]*href="([^"]*)"[^>]*>(.*?)</a>~is',
            fn($m) => '[' . strip_tags($m[2]) . '](' . html_entity_decode($m[1]) . ')',
            $html
        );
    }
    return trim(html_entity_decode(strip_tags($html), ENT_QUOTES, 'UTF-8'));
}

function cms_field(array $field, ?string $value): string {
    if ($value === null) return $field['default']; // not edited: use the built-in default, exactly as Astro built it
    return match ($field['type']) {
        'html' => cms_rich($value),
        'url' => cms_esc(cms_url($value)),
        'datetime' => preg_match('/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d([+-]\d\d:\d\d|Z)$/', $value) ? cms_esc($value) : $field['default'],
        default => cms_esc($value),
    };
}

/** @return array<string,string> page path => rendered HTML */
function cms_render_all(array $values): array {
    $manifest = cms_manifest();
    $pages = [];
    foreach ($manifest['templates'] as $rel) {
        $template = cms_expand_lists((string)file_get_contents(cms_dir() . '/tpl/' . $rel), $manifest, $values);
        $pages[$rel] = preg_replace_callback('/%%CMS:([A-Za-z0-9_]+)%%/', function ($match) use ($manifest, $values) {
            $field = $manifest['fields'][$match[1]] ?? null;
            return $field ? cms_field($field, isset($values[$match[1]]) ? (string)$values[$match[1]] : null) : '';
        }, $template);
    }
    return $pages;
}

/* ---------------------------------------------------------------- repeated lists (e.g. racepack items) */

/**
 * A template holds a block like <!--cms-list NAME [when=image|noimage]-->BODY<!--/cms-list-->.
 * BODY is printed once per item in list NAME (from content.json, or the built-in default if not edited).
 * when=image / noimage keeps only items that have / do not have a photo.
 * %%ITEM:n2%% counts items within one page, so numbers run on across blocks.
 */
function cms_expand_lists(string $html, array $manifest, array $values): string {
    $counts = [];
    return (string)preg_replace_callback(
        '~<!--cms-list ([a-z0-9_-]+)(?: when=(image|noimage))?-->(.*?)<!--/cms-list-->~s',
        function ($match) use ($manifest, $values, &$counts) {
            $name = $match[1];
            $when = $match[2] ?? '';
            $body = $match[3];
            $list = $manifest['lists'][$name] ?? ['items' => [], 'fallback' => ['src' => '', 'alt' => ''], 'tbd' => ''];
            $items = $values['lists'][$name] ?? $list['items'];
            $out = '';
            foreach ($items as $item) {
                $hasImage = (string)($item['image'] ?? '') !== '';
                if (($when === 'image' && !$hasImage) || ($when === 'noimage' && $hasImage)) continue;
                $counts[$name] = ($counts[$name] ?? 0) + 1;
                $out .= strtr($body, cms_item_tokens($item, $list, $counts[$name]));
            }
            return $out;
        },
        $html
    );
}

/** One item's values as %%ITEM:...%% tokens. Everything is escaped except %%ITEM:soontag%%, which is HTML. */
function cms_item_tokens(array $item, array $list, int $number): array {
    $fallback = $list['fallback'] ?? ['src' => '', 'alt' => ''];
    $title = (string)($item['title'] ?? '');
    $desc = (string)($item['description'] ?? '');
    $image = (string)($item['image'] ?? '');
    $alt = (string)($item['alt'] ?? '');
    $hasImage = $image !== '';
    $emoji = trim((string)($item['emoji'] ?? '')) ?: '🎁';
    $e = fn($s) => cms_esc((string)$s);
    return [
        '%%ITEM:title%%' => $e($title),
        '%%ITEM:desc%%' => $e($desc),
        '%%ITEM:image%%' => $e($image),
        '%%ITEM:w%%' => $hasImage ? (string)(int)($item['w'] ?? 0) : '',
        '%%ITEM:h%%' => $hasImage ? (string)(int)($item['h'] ?? 0) : '',
        '%%ITEM:n%%' => (string)$number,
        '%%ITEM:n2%%' => sprintf('%02d', $number),
        '%%ITEM:psrc%%' => $e($hasImage ? $image : $fallback['src']),
        '%%ITEM:palt%%' => $e($hasImage ? ($alt !== '' ? $alt : $title) : $fallback['alt']),
        '%%ITEM:pdesc%%' => $e($desc === ($list['tbd'] ?? '') ? '' : $desc),
        '%%ITEM:soon%%' => $hasImage ? '0' : '1',
        '%%ITEM:soontag%%' => $hasImage ? '' : '<em class="pick-tag">Coming soon</em>',
        '%%ITEM:emoji%%' => $e($emoji),
    ];
}

/* ---------------------------------------------------------------- publish and save */

/** Re-render every page from the templates and client values. If rendering fails, nothing is written. */
function cms_publish(array $values): int {
    $pages = cms_render_all($values); // render everything first; if it fails, the live site stays as it was
    foreach ($pages as $rel => $html) cms_write(cms_public() . '/' . $rel, $html);
    cms_write(cms_dir() . '/state/rendered', sha1($pages['index.html'] ?? ''));
    return count($pages);
}

/** After a zip extract, index.html may be the plain build again. If so, re-apply the client's edits. */
function cms_sync(array $values): bool {
    $index = cms_public() . '/index.html';
    if (is_file($index) && sha1_file($index) === trim((string)@file_get_contents(cms_dir() . '/state/rendered'))) return false;
    cms_publish($values);
    return true;
}

/** Save client values (keeping a copy of the previous version), then publish. */
function cms_save(array $values): int {
    cms_render_all($values); // test the render before touching anything
    $file = cms_data() . '/content.json';
    if (is_file($file)) {
        @mkdir(cms_data() . '/history', 0755, true);
        copy($file, cms_data() . '/history/' . date('Ymd-His') . '.json');
    }
    cms_write($file, json_encode(['values' => $values], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    return cms_publish($values);
}

/* ---------------------------------------------------------------- images */

/** @return string public URL of the saved image, or an error message starting with "!" */
function cms_upload(array $file, array $field, string $base): string {
    if (($file['error'] ?? 1) !== UPLOAD_ERR_OK || $file['size'] > 6 * 1048576) return '!Upload failed or larger than 6 MB.';
    $info = @getimagesize($file['tmp_name']);
    $ext = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp', IMAGETYPE_GIF => 'gif'][$info[2] ?? 0] ?? null;
    if (!$ext) return '!Only JPG, PNG, WebP, or GIF images are allowed.';
    if (!empty($field['width']) && !empty($field['height'])) {
        $ratioUploaded = $info[0] / $info[1];
        $ratioExpected = $field['width'] / $field['height'];
        if (abs($ratioUploaded / $ratioExpected - 1) > 0.06) {
            return "!Image ratio does not match. Expected about {$field['width']}×{$field['height']}, uploaded {$info[0]}×{$info[1]}.";
        }
    }
    $dir = cms_data() . '/uploads';
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $web = str_starts_with($dir, cms_public()) ? substr($dir, strlen(cms_public())) : null;
    if ($web === null) return '!data_dir must be inside public_html so images can display.';
    $name = date('Ymd') . '-' . bin2hex(random_bytes(4)) . ".$ext";
    return move_uploaded_file($file['tmp_name'], "$dir/$name") ? "$base$web/$name" : '!Failed to save image.';
}

/* ---------------------------------------------------------------- login */

function cms_session(): void {
    session_name('cmsid');
    session_set_cookie_params(['path' => '/', 'secure' => !empty($_SERVER['HTTPS']), 'httponly' => true, 'samesite' => 'Strict']);
    @mkdir(cms_dir() . '/state', 0755, true);
    session_save_path(cms_dir() . '/state');
    session_start();
}

function cms_csrf(): string {
    return $_SESSION['csrf'] ??= bin2hex(random_bytes(16));
}

function cms_csrf_ok(): bool {
    return hash_equals($_SESSION['csrf'] ?? '', (string)($_POST['csrf'] ?? ''));
}

function cms_login(string $username, string $password): bool {
    // Always run password_verify, even for unknown users, so response time does not reveal valid usernames
    $hash = cms_config()['users'][$username] ?? '$2y$10$abcdefghijklmnopqrstuuYB1FNBy9xfkJjuQ0Kg0u8W6vK8fTq2';
    return password_verify($password, $hash) && isset(cms_config()['users'][$username]);
}
