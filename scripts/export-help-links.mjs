import { mkdirSync, writeFileSync } from 'node:fs';
import { articles, categories } from '../src/lib/content.ts';
import { portalPages } from '../src/lib/page-guides.ts';
import { absoluteUrl } from '../src/lib/site.ts';

const lines = [
  'INYICE HELP CENTER — MAIN PROJECT INTEGRATION',
  '',
  'Add a help icon beside each page title using the matching URL below.',
  'Match route patterns through your router (for example React Router matchPath), not substring matching.',
  'Use pathname only; ignore query strings and hashes. :uid and :token match one path segment.',
  'Match specific routes before dynamic routes; use * only as the final fallback.',
  'Never put actual IDs, tokens, emails, or other private values into help URLs.',
  'For an unmapped screen, use https://help.inyice.com/pages.',
  'Use an accessible label such as "Help with Orders" and a visible tooltip.',
  'Example: <a href="https://help.inyice.com/articles/orders-page" target="_blank" rel="noopener noreferrer" aria-label="Help with Orders">Help icon</a>',
  'Scope: all agency/public routes tracked by this help project; provider/internal pages are excluded.',
  'Confirm these patterns against the current main-project router before integrating.',
  '',
  `PORTAL PAGE MAPPINGS (${portalPages.length})`,
  'Route pattern | Page name | Help URL',
  ...portalPages.map(([route, title, slug]) => {
    if (!articles.some(article => article.slug === slug)) throw new Error(`Missing guide: ${slug}`);
    return `${route} | ${title} | ${absoluteUrl(`/articles/${slug}`)}`;
  }),
  '',
  `ALL HELP GUIDES (${articles.length}) — additional contextual links for tabs and actions`,
  'Guide title | Portal navigation | Help URL',
  ...articles.map(article => `${article.title} | ${article.path} | ${absoluteUrl(`/articles/${article.slug}`)}`),
  '',
  'HELP DIRECTORY AND TOPICS',
  `Help Center | ${absoluteUrl('/')}`,
  `All portal pages | ${absoluteUrl('/pages')}`,
  ...categories.map(category => `${category.title} | ${absoluteUrl(`/topics/${category.slug}`)}`),
  '',
  'Regenerate in the help project with: npm run export:help-links',
];
mkdirSync('exports', { recursive: true });
writeFileSync('exports/main-project-help-links.txt', lines.join('\n') + '\n');
console.log(`Exported ${portalPages.length} page mappings and ${articles.length} guides.`);
