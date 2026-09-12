import test from 'node:test';
import assert from 'node:assert/strict';
import { articles, categories } from '../src/lib/content.ts';
import { articleSchema, collectionSchema, pageMetadata, serializeJsonLd } from '../src/lib/seo.ts';
import { llmsIndex, llmsFullText } from '../src/lib/llms.ts';
import { commonQuestions } from '../src/lib/common-questions.ts';
import { absoluteUrl, site } from '../src/lib/site.ts';

test('discovery documents cover every public guide without leaking private artifacts', () => {
  const index = llmsIndex();
  const full = llmsFullText();
  for (const article of articles) {
    const url = absoluteUrl(`/articles/${article.slug}`);
    assert.ok(index.includes(url), article.slug);
    assert.ok(full.includes(url), article.slug);
    for (const step of article.steps) assert.ok(full.includes(step), article.slug);
    assert.ok(full.includes(article.note), article.slug);
  }
  assert.doesNotMatch(index + full, /auth_token|storageState|portal-session|\/internal|Rihla@|rihltravel|localhost|artifacts\//i);
  assert.ok(index.includes(`${site.url}/llms-full.txt`));
});

test('article metadata and structured data describe the actual guide', () => {
  for (const article of articles) {
    const category = categories.find(item => item.slug === article.category);
    const schema = articleSchema(article, category);
    const [entity, breadcrumbs] = schema['@graph'];
    const path = `/articles/${article.slug}`;
    assert.equal(entity.url, absoluteUrl(path));
    assert.equal(entity.headline, article.title);
    for (const step of article.steps) assert.ok(entity.articleBody.includes(step));
    assert.equal(breadcrumbs.itemListElement.at(-1).item, entity.url);
    const metadata = pageMetadata(article.title, article.description, path);
    assert.equal(metadata.alternates.canonical, path);
    assert.equal(metadata.openGraph.url, entity.url);
    assert.equal(metadata.twitter.description, article.description);
    assert.equal(entity.dateModified, undefined, 'Do not invent freshness dates');
  }
});

test('collection data and common answers link to existing public guides', () => {
  for (const category of categories) {
    const guides = articles.filter(article => article.category === category.slug);
    const [collection] = collectionSchema(category.title, category.description, `/topics/${category.slug}`, guides)['@graph'];
    assert.equal(collection.mainEntity.numberOfItems, guides.length);
    assert.deepEqual(collection.mainEntity.itemListElement.map(item => item.url), guides.map(guide => absoluteUrl(`/articles/${guide.slug}`)));
  }
  for (const item of commonQuestions) assert.ok(articles.some(article => article.slug === item.slug));
});

test('JSON-LD serialization cannot close its script element', () => {
  const data = { text: '</script><script>alert(1)</script>' };
  const serialized = serializeJsonLd(data);
  assert.ok(!serialized.includes('<'));
  assert.deepEqual(JSON.parse(serialized), data);
});
