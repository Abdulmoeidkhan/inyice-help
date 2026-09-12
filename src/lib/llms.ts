import { articles, categories } from './content.ts';
import { screenshots } from './screenshots.ts';
import { absoluteUrl, site } from './site.ts';

export function llmsIndex() {
  return [
    `# ${site.name}`,
    `> ${site.description}`,
    'These public guides explain the inYice product. Available portal screens depend on the signed-in user’s role. They do not contain live booking or account data.',
    `## Start here\n\n- [Help center](${site.url}/): Browse topics and search guides.\n- [Help by page](${site.url}/pages): Find a guide by portal screen.\n- [Full guide text](${site.url}/llms-full.txt): All public instructions in one text document.\n- [Sitemap](${site.url}/sitemap.xml): Canonical HTML pages.`,
    ...categories.map(category => `## ${category.title}\n\n${articles.filter(article => article.category === category.slug).map(article => `- [${article.title}](${absoluteUrl(`/articles/${article.slug}`)}): ${article.description}`).join('\n')}`),
    `## Optional\n\n- [inYice](${ 'https://inyice.com' }): Product website.\n- [Contact inYice](https://inyice.com/contact): Product support.`,
  ].join('\n\n') + '\n';
}

export function llmsFullText() {
  return [`# ${site.name}`, `> ${site.description}`, 'The following text mirrors the public HTML guides. Each source link identifies the corresponding guide.',
    ...articles.map(article => [
      `## ${article.title}`, `Source: ${absoluteUrl(`/articles/${article.slug}`)}`,
      article.description, `Where to go: ${article.path}`,
      article.steps.map((step, index) => `${index + 1}. ${step}`).join('\n'),
      `Good to know: ${article.note}`,
      ...(screenshots[article.slug] ?? []).map(image => `Screenshot: [${image.caption}](${absoluteUrl(image.src)})`),
      ...(article.image ? [`Screenshot: ${absoluteUrl(article.image)}`] : []),
      `Related guides: ${article.related.map(slug => absoluteUrl(`/articles/${slug}`)).join(', ')}`,
    ].join('\n\n')),
  ].join('\n\n') + '\n';
}
