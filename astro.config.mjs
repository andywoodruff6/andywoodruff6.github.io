import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://andywoodruff.net',
  integrations: [mdx(), sitemap()],

  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },

  build: {
    format: 'directory',
  },

  trailingSlash: 'always',
  adapter: cloudflare()
});