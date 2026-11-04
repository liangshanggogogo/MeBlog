import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import { readingMarkup } from './src/lib/reading-markup.mjs';

export default defineConfig({
  site: process.env.SITE_URL || 'https://liangshanggogogo.github.io',
  base: process.env.BASE_PATH || '/MeBlog',
  trailingSlash: 'always',
  output: 'static',
  devToolbar: { enabled: false },
  vite: {
    plugins: [{
      name: 'non-blocking-cjk-fonts',
      enforce: 'pre',
      transform(code, id) {
        // Large CJK subsets must not delay reading or replace text late on slow connections.
        if (id.includes('@fontsource-variable/noto-serif-sc') && id.endsWith('.css')) {
          return { code: code.replaceAll('font-display: swap', 'font-display: optional'), map: null };
        }
      },
    }],
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
    },
    processor: unified({ rehypePlugins: [readingMarkup] }),
  },
});
