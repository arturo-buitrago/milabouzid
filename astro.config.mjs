// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Root custom domain (milabouzid.com) — no `base`.
  // `output: 'static'` is Astro's default, so the site builds to plain files in dist/.
  site: 'https://milabouzid.com',
});
