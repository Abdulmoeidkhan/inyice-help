// Requires an authenticated Playwright storage state kept outside public content.
// Captures only; never saves company settings or changes invoice records.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const origin = process.env.PORTAL_BASE_URL || 'https://portal-inyice.test';
const output = 'artifacts/tax-screenshots';

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      storageState: process.env.PORTAL_STORAGE_STATE || 'artifacts/portal-session.json',
      viewport: { width: 1440, height: 1100 },
    });
    const page = await context.newPage();
    const open = async route => {
      await page.goto(new URL(route, origin).href);
      await page.waitForTimeout(1800);
      if (page.url().includes('/login')) throw new Error('Portal session expired. Sign in again.');
      await page.evaluate(() => document.fonts.ready);
    };
    const capture = async (name, locator, mask = []) => {
      await locator.screenshot({ path: path.join(output, `${name}.png`), mask, maskColor: '#d8dee8', animations: 'disabled' });
      console.log(`Captured ${name}`);
    };

    await open('/profile/company');
    const taxCard = page.locator('.ant-card').filter({ has: page.locator('.ant-card-head-title').getByText('Invoice tax', { exact: true }) }).last();
    await capture('company-tax', taxCard, [page.locator('#tax_settings_registration_number')]);

    await open('/reports/tax');
    // Preserve report labels and layout while covering identifiers and amounts.
    const privateCells = page.locator('tbody tr:not(.ant-table-measure-row) td').filter({ hasNot: page.getByText('View', { exact: true }) });
    const summaryValues = page.locator('.ant-statistic-content');
    await capture('tax-report', page.locator('main'), [privateCells, summaryValues]);
    await page.getByText('View', { exact: true }).first().click();
    await page.locator('.invoice-totals').waitFor();
    await capture('invoice-tax', page.locator('.invoice-totals'), [page.locator('.invoice-totals > div > span:last-child')]);

    await open('/vat-calculator');
    await page.getByPlaceholder('e.g. PKR').fill('PKR');
    await page.getByRole('combobox').nth(1).click();
    await page.locator('.ant-select-dropdown:visible').getByText('2', { exact: true }).click();
    await page.getByPlaceholder('Enter amount').fill('1000');
    await page.getByPlaceholder('Enter rate').fill('10');
    await page.getByText('Breakdown by VAT rate', { exact: true }).waitFor();
    await capture('vat-calculator-add', page.locator('main'));
    await page.getByRole('combobox').first().click();
    await page.locator('.ant-select-dropdown:visible').getByText('Extract VAT from gross amounts', { exact: true }).click();
    await page.getByPlaceholder('Enter amount').fill('1100');
    await capture('vat-calculator-extract', page.locator('main'));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
