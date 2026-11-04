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
    '/categories/': withBase('/articles/'),
    '/categories/trends/': withBase('/articles/category/trends/'),
    '/categories/principles/': withBase('/articles/category/principles/'),
    '/categories/practice/': withBase('/articles/category/practice/'),
    '/categories/cognition/': withBase('/articles/category/cognition/'),
    '/trends/': withBase('/articles/category/trends/'),
    '/trends/daily/': withBase('/articles/category/trends/'),
    '/trends/weekly/': withBase('/articles/category/trends/'),
    '/categories/ai/': withBase('/articles/category/practice/'),
    '/categories/tutorials/': withBase('/articles/category/principles/'),
    '/categories/reading/': withBase('/articles/category/cognition/'),
    '/categories/life/': withBase('/articles/'),
  },
  devToolbar: { enabled: false },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.endsWith('/three/build/three.core.js')) return 'three-core';
            if (id.endsWith('/three/build/three.module.js')) return 'three-renderer';
          },
        },
      },
    },
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
