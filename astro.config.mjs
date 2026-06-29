// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

const siteUrl = process.env.SITE_URL ?? 'https://kujera-furniture-starter.vercel.app';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  output: 'static',
  integrations: [preact()],
});
