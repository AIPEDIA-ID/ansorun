// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Ganti dengan domain produksi (dipakai untuk canonical URL)
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
