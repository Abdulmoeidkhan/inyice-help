const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
(async () => {
  require('node:fs').mkdirSync('artifacts', { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push({ message: error.message, stack: error.stack, url: page.url() }));
  const base = process.env.HELP_BASE_URL || 'http://localhost:3001';
  await page.goto(base); await page.waitForFunction(() => document.documentElement.dataset.theme);
  await page.waitForFunction(() => document.documentElement.dataset.theme);
  await page.getByRole('heading', { name: /A little guidance/ }).waitFor();
  await page.getByRole('textbox', { name: 'Search help articles' }).fill('customer receipt');
  await page.locator('#search-results').getByRole('link', { name: /Record a customer receipt/ }).click();
  await page.getByRole('heading', { name: 'Record a customer receipt', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Yes, thank you' }).click();
  assert.equal(await page.getByRole('button', { name: 'Yes, thank you' }).getAttribute('aria-pressed'), 'true');
  await page.reload();
  await page.waitForFunction(() => document.querySelector('[aria-pressed=true]'));
  await page.goto(base); await page.waitForFunction(() => document.documentElement.dataset.theme);
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.reload();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  await page.screenshot({ path: 'artifacts/help-dark.png', fullPage: true });
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await page.getByRole('textbox', { name: 'Search help articles' }).fill('zznonexistentzz');
  await page.getByText('0 guides found').waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('textbox', { name: 'Search help articles' }).inputValue(), '');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Quick start guide' }).click();
  await page.getByRole('heading', { name: 'Your first booking, step by step' }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  await page.screenshot({ path: 'artifacts/help-article-mobile.png', fullPage: true });
  await page.goto(base); await page.waitForFunction(() => document.documentElement.dataset.theme);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  await page.screenshot({ path: 'artifacts/help-mobile.png', fullPage: true });
  await page.goto(base + '/pages');
  await page.getByRole('heading', { name: 'Find help for your page.' }).waitFor();
  const directoryLinks = page.locator('.directory-link');
  const { portalPages } = await import('../src/lib/page-guides.ts');
  assert.equal(await directoryLinks.count(), portalPages.length);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  await page.screenshot({ path: 'artifacts/help-page-directory-mobile.png', fullPage: true });
  await page.getByRole('link', { name: /^Refund Allocation/ }).click();
  await page.getByRole('heading', { name: 'Refund Allocation: settle refund orders' }).waitFor();
  const { articles } = await import('../src/lib/content.ts');
  const { screenshots } = await import('../src/lib/screenshots.ts');
  const imageSources = new Set([
    ...Object.values(screenshots).flat().map(image => image.src),
    ...articles.filter(article => article.image).map(article => article.image),
  ]);
  for (const src of imageSources) {
    const response = await page.request.get(base + src);
    assert.equal(response.status(), 200, src);
    assert.match(response.headers()['content-type'], /^image\/png/, src);
  }
  for (const slug of ['dashboard', 'customers-page', 'forgot-password']) {
    await page.goto(base + '/articles/' + slug);
    const images = page.locator('.guide-screenshots img');
    assert.equal(await images.count(), screenshots[slug].length);
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(element => element.decode());
      assert.ok(await image.evaluate(element => element.naturalWidth > 0));
    }
  }
  for (const article of articles) {
    const response = await page.request.get(base + '/articles/' + article.slug);
    assert.equal(response.status(), 200, article.slug);
  }
  for (const path of ['/topics/orders-vouchers', '/articles/sign-in', '/articles/register-your-agency', '/sitemap.xml', '/robots.txt']) {
    const response = await page.goto(base + path);
    assert.equal(response.status(), 200, path);
  }
  const missing = await page.goto(base + '/articles/nonexistent-guide');
  assert.equal(missing.status(), 404);
  await page.getByRole('heading', { name: 'Let’s get you back on track.' }).waitFor();
  assert.deepEqual(errors, []);
  console.log(`Browser checks passed: ${articles.length} article routes, ${portalPages.length} directory entries, search, no results, feedback persistence, theme persistence, mobile navigation, overflow, topic routes, sitemap, robots, and 404.`);
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });

