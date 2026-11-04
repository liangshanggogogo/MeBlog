import { getCollection, type CollectionEntry } from 'astro:content';

export const categories = [
  { id: 'ai', name: 'AI 实践', english: 'Explore & build', icon: 'cpu', description: '走进模型与工具，在动手中理解 AI。' },
  { id: 'tutorials', name: '技术教程', english: 'Learn & explain', icon: 'code', description: '拆解原理，记录过程，把复杂的事讲清楚。' },
  { id: 'reading', name: '读书思考', english: 'Read & reflect', icon: 'book-open', description: '从书页出发，遇见新的问题和看法。' },
  { id: 'life', name: '生活随笔', english: 'Live & notice', icon: 'sun-horizon', description: '留心日常，也给偶尔的漫想留个位置。' },
] as const;

export type Article = CollectionEntry<'articles'>;
export const categoryFor = (id: string) => categories.find((category) => category.id === id)!;
export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const articleUrl = (article: Article) => url(`articles/${article.id.replace(/\/index$/, '')}/`);
export const getArticles = async () => (await getCollection('articles', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
export const dateLabel = (date: Date) => new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
}).format(date);
export const shortDate = (date: Date) => date.toISOString().slice(0, 10).replaceAll('-', '.');
export function readingMinutes(body = '') {
  const plain = body.replace(/```[\s\S]*?```/g, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  const chinese = (plain.match(/[\u3400-\u9fff]/g) || []).length;
  const words = (plain.match(/[a-zA-Z0-9]+/g) || []).length;
  return Math.max(1, Math.ceil(chinese / 350 + words / 200));
}
