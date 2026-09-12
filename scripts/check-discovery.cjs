const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

(async () => {
  const { articles, categories } = await import('../src/lib/content.ts');
  const { screenshots } = await import('../src/lib/screenshots.ts');
  const { site } = await import('../src/lib/site.ts');
  const base = process.env.HELP_BASE_URL || 'http://localhost:3001';
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ javaScriptEnabled: false, userAgent: 'OAI-SearchBot' });
    const page = await context.newPage();
    const routes = ['/', '/pages', ...categories.map(c => `/topics/${c.slug}`), ...articles.map(a => `/articles/${a.slug}`)];
    for (const route of routes) {
      const response = await context.request.get(base + route);
      assert.equal(response.status(), 200, route);
      const documentData = await page.evaluate(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return {
          title: doc.title,
          description: doc.querySelector('meta[name="description"]')?.content,
          canonicals: [...doc.querySelectorAll('link[rel="canonical"]')].map(el => el.href),
          og: doc.querySelector('meta[property="og:url"]')?.content,
          robots: [...doc.querySelectorAll('meta[name="robots"]')].map(el => el.content),
          headings: doc.querySelectorAll('h1').length,
          graphs: [...doc.querySelectorAll('script[type="application/ld+json"]')].flatMap(el => JSON.parse(el.textContent)['@graph'] || []),
          steps: [...doc.querySelectorAll('.steps li p')].map(el => el.textContent),
        };
      }, await response.text());
      assert.ok(documentData.title && documentData.description, route);
      assert.deepEqual(documentData.canonicals, [site.url + route], route);
      assert.equal(new URL(documentData.og).href, site.url + route, route);
      assert.equal(documentData.headings, 1, route);
      assert.ok(!documentData.robots.some(value => /noindex|nosnippet/.test(value)), route);
      assert.ok(documentData.graphs.some(entity => entity['@type'] === 'WebSite'), route);
      const article = articles.find(item => route === `/articles/${item.slug}`);
      if (article) {
        assert.deepEqual(documentData.steps, article.steps, route);
        assert.ok(documentData.graphs.some(entity => entity['@type'] === 'TechArticle' && entity.headline === article.title), route);
        assert.ok(documentData.graphs.some(entity => entity['@type'] === 'BreadcrumbList'), route);
      }
    }
    for (const path of ['/llms.txt', '/llms-full.txt']) {
      const response = await context.request.get(base + path);
      assert.equal(response.status(), 200, path);
      assert.match(response.headers()['content-type'], /text\/plain/);
      const text = await response.text();
      for (const article of articles) assert.ok(text.includes(`${site.url}/articles/${article.slug}`), article.slug);
      assert.doesNotMatch(text, /portal-session|auth_token|\/internal|Rihla@|rihltravel/i);
    }
    const robots = await (await context.request.get(base + '/robots.txt')).text();
    assert.match(robots, /User-Agent: \*\s+Allow: \//i);
    assert.ok(robots.includes(site.url + '/sitemap.xml'));
    const sitemap = await (await context.request.get(base + '/sitemap.xml')).text();
    for (const route of routes) assert.ok(sitemap.includes(`<loc>${site.url}${route}</loc>`), route);
    const images = new Set([...Object.values(screenshots).flat().map(image => image.src), ...articles.filter(a => a.image).map(a => a.image)]);
    for (const image of images) {
      const response = await context.request.get(base + image);
      assert.equal(response.status(), 200, image);
      assert.match(response.headers()['content-type'], /image\/png/);
    }
    for (const path of ['/articles/not-a-guide', '/topics/not-a-topic', '/artifacts/portal-session.json', '/DEVELOPER_GUIDE.md']) {
      assert.equal((await context.request.get(base + path)).status(), 404, path);
    }
    await page.goto(base + '/articles/create-order');
    assert.equal(await page.locator('.steps li').count(), articles.find(a => a.slug === 'create-order').steps.length);
    const image = page.locator('.guide-screenshots img').first();
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(el => el.decode());
    assert.ok(await image.evaluate(el => el.naturalWidth > 0));
    console.log(`Discovery checks passed: ${routes.length} HTML pages, metadata, structured data, ${images.size} images, sitemap, robots, both text documents, private-file 404s, and a guide rendered without JavaScript.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
