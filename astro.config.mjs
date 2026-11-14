// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Ganti dengan domain produksi (dipakai untuk canonical URL)
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  vite: {
    plugins: [tailwindcss()],
  },
});
