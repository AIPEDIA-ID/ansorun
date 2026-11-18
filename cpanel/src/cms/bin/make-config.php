<?php
/**
 * Membuat/menambah akun admin di config.php (hash bcrypt, kata sandi tidak disimpan polos).
 *   php cpanel/src/cms/bin/make-config.php nama-pengguna              -> cpanel/local/config.php (di luar git)
 *   php cpanel/src/cms/bin/make-config.php nama-pengguna /path/config.php
 * Unggah hasilnya SEKALI ke /home/USER/cms/config.php (izin 600). Tidak ikut zip, jadi update tidak menimpanya.
 */
$user = $argv[1] ?? '';
$file = $argv[2] ?? getcwd() . '/cpanel/local/config.php';
if (!is_dir(dirname($file))) mkdir(dirname($file), 0755, true);
if (!preg_match('/^[A-Za-z0-9._-]{3,40}$/', $user)) { fwrite(STDERR, "Pakai: php cpanel/src/cms/bin/make-config.php <nama-pengguna> [config.php]\n"); exit(2); }
fwrite(STDERR, "Kata sandi untuk $user (min. 10 karakter): ");
@system('stty -echo 2>/dev/null');
$pass = trim((string)fgets(STDIN));
@system('stty echo 2>/dev/null');
fwrite(STDERR, "\n");
if (strlen($pass) < 10) { fwrite(STDERR, "Terlalu pendek.\n"); exit(1); }
$cfg = is_file($file) ? (require $file) : [];
$cfg['users'][$user] = password_hash($pass, PASSWORD_DEFAULT);
file_put_contents($file, "<?php\nreturn " . var_export($cfg, true) . ";\n", LOCK_EX);
@chmod($file, 0600);
fwrite(STDERR, "Tersimpan di $file\n");
