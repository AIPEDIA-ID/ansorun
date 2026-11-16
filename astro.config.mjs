// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { isLive } from './src/lib/pages.mjs';

export default defineConfig({
  // Ganti dengan domain produksi (dipakai untuk canonical URL)
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  integrations: [sitemap({ filter: (url) => isLive(new URL(url).pathname) })],
  vite: {
    plugins: [tailwindcss()],
  },
});
