<?php
/**
 * Contoh bentuk config.php. Jangan diisi manual: buat dengan
 *   php cpanel/src/cms/bin/make-config.php nama-pengguna
 * (hasilnya di cpanel/local/config.php, di luar git; unggah sekali ke cms/config.php).
 *
 * 'public_html' hanya perlu diisi bila folder situs bukan DOCUMENT_ROOT (mis. subdomain staging).
 */
return [
    'users' => [
        // 'admin' => '$2y$10$....hash....',
    ],
    // 'public_html' => '/home/USER/public_html',
];
