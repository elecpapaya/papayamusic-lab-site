import { defineConfig } from 'astro/config';

export default defineConfig({
  base: process.env.PAPAYA_SITE_BASE ?? '/',
  output: 'static',
});
