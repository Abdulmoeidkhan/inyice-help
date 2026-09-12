import type { Metadata } from 'next';
import type { Article } from './content.ts';
import { screenshots } from './screenshots.ts';
import { absoluteUrl, site } from './site.ts';

export function pageMetadata(title: string, description: string, path: string, image = site.image, type: 'website' | 'article' = 'website'): Metadata {
  return {
    title, description,
    alternates: { canonical: path },
    openGraph: { title, description, url: absoluteUrl(path), siteName: site.name, locale: 'en_US', type, images: [{ url: absoluteUrl(image), alt: image === site.image ? 'inYice Help Center — Clarity for every step of your journey.' : title, ...(image === site.image ? { width: 1200, height: 630, type: 'image/png' } : {}) }] },
    twitter: { card: 'summary_large_image', title, description, images: [absoluteUrl(image)] },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return { '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: absoluteUrl(item.path) })) };
}

export function articleSchema(article: Article, category: { title: string; slug: string }) {
  const url = absoluteUrl(`/articles/${article.slug}`);
  const images = [...(screenshots[article.slug] ?? []).map(image => absoluteUrl(image.src)), ...(article.image ? [absoluteUrl(article.image)] : [])];
  return { '@context': 'https://schema.org', '@graph': [
    {
      '@type': 'TechArticle', '@id': `${url}#article`, url,
      headline: article.title, description: article.description, inLanguage: 'en',
      articleSection: category.title,
      articleBody: [article.description, `Where to go: ${article.path}`, ...article.steps.map((step, i) => `${i + 1}. ${step}`), article.note].join('\n\n'),
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      isPartOf: { '@id': `${site.url}/#website` },
      publisher: { '@id': 'https://inyice.com/#organization' },
      ...(images.length ? { image: images } : {}),
    },
    breadcrumbSchema([{ name: 'Help Center', path: '/' }, { name: category.title, path: `/topics/${category.slug}` }, { name: article.title, path: `/articles/${article.slug}` }]),
  ] };
}

export function collectionSchema(title: string, description: string, path: string, guides: Article[]) {
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', '@id': absoluteUrl(path), name: title, description, url: absoluteUrl(path), inLanguage: 'en', isPartOf: { '@id': `${site.url}/#website` }, mainEntity: {
      '@type': 'ItemList', numberOfItems: guides.length,
      itemListElement: guides.map((guide, i) => ({ '@type': 'ListItem', position: i + 1, name: guide.title, url: absoluteUrl(`/articles/${guide.slug}`) })),
    } },
    breadcrumbSchema([{ name: 'Help Center', path: '/' }, { name: title, path }]),
  ] };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
