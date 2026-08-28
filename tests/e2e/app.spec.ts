import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

test('@claim:sample-loop opens a prepared dialogue with a selected line and three-second gap', async ({ page }) => {
  await page.goto('/demo/');
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bakery greeting' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Je voudrais deux croissants/i })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByLabel('Silent gap between repetitions')).toHaveValue('3');
  await expect(page.getByText('3 repeats', { exact: true })).toBeVisible();
});

test('@claim:demo-isolation keeps demo records and preferences out of real storage, then resets them', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('agl_selected_clip', 'real-clip'));
  await page.goto('/demo/');
  const before = await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => { const request = indexedDB.open('demo:audio-gap-loop'); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    const count = await new Promise<number>((resolve, reject) => { const request = database.transaction('clips').objectStore('clips').count(); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    database.close(); return { real: localStorage.getItem('agl_selected_clip'), demo: localStorage.getItem('demo:agl_selected_clip'), count };
  });
  expect(before).toEqual({ real: 'real-clip', demo: 'demo-bakery-greeting', count: 1 });
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Sample practice loop reset.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bakery greeting' })).toBeVisible();
});

test('@claim:offline-reload reloads the demo player while offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('Offline. Your saved clips and practice tools still work.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bakery greeting' })).toBeVisible();
  await context.setOffline(false);
});

test('@claim:csv-export downloads one row per recorded demo session', async ({ page }) => {
  await page.goto('/demo/');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export log CSV' }).click();
  const file = await download;
  expect(await file.suggestedFilename()).toMatch(/^audio-gap-loop-log-.*\.csv$/);
  const body = await readFile(await file.path());
  expect(body.toString()).toContain('completed_at,clip,repetitions,seconds_listened');
  expect(body.toString().split('\n')).toHaveLength(2);
});

test('@claim:backup-export downloads a JSON backup containing the sample clip', async ({ page }) => {
  await page.goto('/demo/');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/^audio-gap-loop-backup-.*\.json$/);
  const text = await readFile(await file.path(), 'utf8');
  expect(JSON.parse(text).clips[0].title).toBe('Bakery greeting');
});

test('@claim:local-only-demo makes no third-party request during a complete demo visit', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/demo/');
  await page.getByRole('button', { name: /Je voudrais deux croissants/i }).click();
  await page.getByRole('button', { name: 'Export log CSV' }).click();
  expect(requests.every(url => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('routes have titles, focusable landmarks, and no serious axe issues', async ({ page }) => {
  for (const route of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page).toHaveTitle(/Audio Gap Loop/);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }
});

test('mobile layout has no horizontal overflow and legal links work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page.getByRole('heading', { name: 'Privacy information' })).toBeVisible();
});
