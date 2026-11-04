import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import { readingMarkup } from './src/lib/reading-markup.mjs';

const basePath = process.env.BASE_PATH || '/MeBlog';
const withBase = (path) => `${basePath.replace(/\/$/, '')}${path}`;

export default defineConfig({
  site: process.env.SITE_URL || 'https://liangshanggogogo.github.io',
  base: basePath,
  trailingSlash: 'always',
  output: 'static',
  redirects: {
    '/trends/': withBase('/categories/trends/'),
    '/trends/daily/': withBase('/categories/trends/'),
    '/trends/weekly/': withBase('/categories/trends/'),
    '/categories/ai/': withBase('/categories/practice/'),
    '/categories/tutorials/': withBase('/categories/principles/'),
    '/categories/reading/': withBase('/categories/cognition/'),
    '/categories/life/': withBase('/categories/'),
  },
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
