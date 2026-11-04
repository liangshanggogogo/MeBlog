import { getCollection, type CollectionEntry } from 'astro:content';

export const categories = [
  { id: 'principles', name: '原理 / 技术', icon: 'cpu', description: '拆解技术与案例背后的原理，把复杂的事讲清楚。' },
  { id: 'practice', name: '动手 / 实践', icon: 'code', description: '构造产品原型，实测模型能力，探索开源项目的使用场景。' },
  { id: 'cognition', name: '系统 / 认知', icon: 'book-open', description: '从书、访谈与实践中学习，更新认知，探索与 AI 协作的方法。' },
] as const;

export type Article = CollectionEntry<'articles'>;
export type Update = CollectionEntry<'updates'>;
export const trendSection = { name: '趋势 / 进展', icon: 'sun-horizon', description: '以每日短札记录新变化，以每周回顾整理值得关注的进展。' };
export const cadenceLabels = { daily: '每日趋势', weekly: '每周进展' } as const;
export const categoryFor = (id: string) => categories.find((category) => category.id === id)!;
export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const articleUrl = (article: Article) => url(`articles/${article.id.replace(/\/index$/, '')}/`);
export const getArticles = async () => (await getCollection('articles', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
export const getUpdates = async () => (await getCollection('updates', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
export const updateId = (update: Update) => `note-${update.id}`;
export const updateUrl = (update: Update) => `${url('trends/')}#${encodeURIComponent(updateId(update))}`;
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
