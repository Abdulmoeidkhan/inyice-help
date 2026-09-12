import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { articles, categories } from '../src/lib/content.ts';
import { portalPages } from '../src/lib/page-guides.ts';
import { screenshots } from '../src/lib/screenshots.ts';

test('every referenced article screenshot is a published PNG asset', () => {
  const sources = new Set([
    ...Object.values(screenshots).flat().map(image => image.src),
    ...articles.filter(article => article.image).map(article => article.image),
  ]);
  for (const src of sources) {
    assert.ok(src.startsWith('/images/'), `Expected a public image path: ${src}`);
    const image = readFileSync(new URL(`../public${src}`, import.meta.url));
    assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${src} must be a PNG`);
  }
  for (const screenshot of Object.values(screenshots).flat()) {
    const image = readFileSync(new URL(`../public${screenshot.src}`, import.meta.url));
    assert.equal(screenshot.width, image.readUInt32BE(16), `${screenshot.src} width`);
    assert.equal(screenshot.height, image.readUInt32BE(20), `${screenshot.src} height`);
  }
});

test('every portal directory entry has a dedicated guide and unique route', () => {
  assert.equal(new Set(portalPages.map(([route]) => route)).size, portalPages.length);
  assert.equal(new Set(portalPages.map(([, , slug]) => slug)).size, portalPages.length);
  for (const [route, name, slug] of portalPages) {
    assert.ok(articles.some(a => a.slug === slug), `${name} (${route}) needs a guide`);
    assert.doesNotMatch(route, /internal/i);
  }
});

test('directory covers current main-project routes', { skip: !process.env.PORTAL_APP_SOURCE }, () => {
  const source = readFileSync(process.env.PORTAL_APP_SOURCE, 'utf8');
  const routes = [...new Set([...source.matchAll(/<Route\s+path="([^"]+)"/g)].map(match => match[1]))].filter(route => !route.startsWith('/internal'));
  assert.deepEqual(portalPages.map(([route]) => route).sort(), routes.sort());
});

test('every guide has a unique route, valid topic, instructions, and working related links', () => {
  const slugs = articles.map(a => a.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const article of articles) {
    assert.ok(categories.some(c => c.slug === article.category));
    assert.ok(article.steps.length >= 3);
    for (const slug of article.related) assert.ok(slugs.includes(slug), `${article.slug} links to missing ${slug}`);
  }
  for (const category of categories) assert.ok(articles.some(a => a.category === category.slug));
});
test('public source and assets contain no internal access guides or private source documentation', () => {
  const content = JSON.stringify(articles);
  assert.doesNotMatch(content, /super.?admin|inyice-admin|support-executive|\/internal|auth_token|api\/v1|rihltravel|Rihla@/i);
  const publicFiles = readdirSync('public', { recursive: true });
  assert.ok(!publicFiles.some(file => /\.md$|\.txt$|\.env|storageState|cookie/i.test(String(file))));
  for (const file of readdirSync('src', { recursive: true })) {
    if (/\.(tsx?|css)$/.test(String(file))) assert.doesNotMatch(readFileSync(`src/${file}`, 'utf8'), /rihltravel|Rihla@|super-admin|\/internal\//i);
  }
});
