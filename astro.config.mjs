// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // URL deployment: default ke GitHub Pages repo ini
  site: process.env.SITE_URL ?? 'https://aipedia-id.github.io',
  base: process.env.BASE_PATH ?? (process.env.GITHUB_ACTIONS && !process.env.CUSTOM_DOMAIN ? '/ansorun' : '/'),
  integrations: [sitemap()],
  devToolbar: {
    enabled: false,
  },
  // Struktur lama -> baru
  redirects: { '/tentang': '/#tentang', '/lari': '/racepack' },
  vite: {
    plugins: [tailwindcss()],
  },
});
