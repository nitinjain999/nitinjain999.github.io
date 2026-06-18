import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://nitinjain999.github.io',
  integrations: [svelte(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
