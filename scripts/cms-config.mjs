/** Pengaturan CMS bersama. */

/** Domain situs. Bisa ditimpa dari luar: SITE_URL=https://domain-lain npm run cms */
export const SITE_URL = process.env.SITE_URL ?? 'https://ansorun.com';

/** Alamat halaman admin: https://domain/<ADMIN_PATH>/ . Sengaja bukan /admin supaya tidak mudah ditebak. */
export const ADMIN_PATH = process.env.ADMIN_PATH ?? 'nimda-pw';
