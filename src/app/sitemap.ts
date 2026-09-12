import type { MetadataRoute } from 'next';
import { articles, categories } from '@/lib/content';
import { absoluteUrl } from '@/lib/site';
export default function sitemap(): MetadataRoute.Sitemap { return ['/', '/pages', ...categories.map(c => `/topics/${c.slug}`), ...articles.map(a => `/articles/${a.slug}`)].map(path => ({ url: absoluteUrl(path), changeFrequency: 'monthly', priority: path === '/' ? 1 : 0.7 })); }
