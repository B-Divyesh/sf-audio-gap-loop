import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const origin = 'http://127.0.0.1:4173';

function wavFixture(): Buffer {
  const samples = 8000;
  const wav = Buffer.alloc(44 + samples * 2);
  wav.write('RIFF', 0); wav.writeUInt32LE(36 + samples * 2, 4); wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(8000, 24); wav.writeUInt32LE(16000, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
  wav.write('data', 36); wav.writeUInt32LE(samples * 2, 40);
  for (let index = 0; index < samples; index += 1) wav.writeInt16LE(Math.sin(index / 12) * 1200, 44 + index * 2);
  return wav;
}

async function importFixture(page: import('@playwright/test').Page): Promise<void> {
  await page.getByRole('button', { name: 'Import audio file' }).first().click();
  await page.locator('#audio-file').setInputFiles({ name: 'practice.wav', mimeType: 'audio/wav', buffer: wavFixture() });
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByLabel('Clip title').fill('My practice phrase');
  await page.getByLabel('Transcript (one phrase per line)').fill('Bonjour.\nMerci.');
  await page.getByLabel('I have permission to use this audio.').check();
  await page.getByRole('button', { name: 'Save clip locally' }).click();
  await expect(page.getByRole('heading', { name: 'My practice phrase' })).toBeVisible();
}

test('@claim:sample-spoken-loop loads a licensed spoken sample and enters the speaking gap', async ({ page }) => {
  const sampleResponse = page.waitForResponse(response => response.url().endsWith('/assets/french-bonjour-ccby25.oga'));
  await page.goto('/demo/');
  const response = await sampleResponse;
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toMatch(/audio|octet-stream/i);
  await expect(page.getByRole('heading', { name: 'French greeting' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Bonjour.' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByLabel('Speaking gap between repeats')).toHaveValue('3');
  await page.getByRole('button', { name: 'Start timed repeats' }).click();
  await expect(page.locator('.phase-step.active')).toContainText('Listen');
  await expect(page.locator('#phase-label')).toContainText('Your turn', { timeout: 10_000 });
});

test('the direct ?demo=1 route enters the same isolated sample with demo metadata', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Audio Gap Loop');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://audio-gap-loop.sociobot.in/demo/');
  await expect(page.locator('#demo-banner')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'French greeting' })).toBeVisible();
});

test('@claim:demo-isolation keeps real data untouched, resets changes, and clears demo data on exit', async ({ page }) => {
  await page.goto('/');
  await importFixture(page);
  await page.goto('/demo/');
  await page.getByLabel('Speaking gap between repeats').selectOption('7');
  await expect(page.getByLabel('Speaking gap between repeats')).toHaveValue('7');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Speaking gap between repeats')).toHaveValue('3');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(`${origin}/`);
  await expect(page.getByRole('heading', { name: 'My practice phrase' })).toBeVisible();
  const cleared = await page.evaluate(async () => {
    const local = Object.keys(localStorage).filter(key => key.startsWith('demo:'));
    const databases = await indexedDB.databases();
    return { local, database: databases.some(database => database.name === 'demo:audio-gap-loop') };
  });
  expect(cleared).toEqual({ local: [], database: false });
  await page.goto('/demo/');
  await expect(page.getByLabel('Speaking gap between repeats')).toHaveValue('3');
  await expect(page.getByRole('heading', { name: 'French greeting' })).toBeVisible();
});

test('@claim:offline-reload reloads the demo player while offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('Offline. Your saved clips and practice tools still work.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'French greeting' })).toBeVisible();
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

test('@claim:backup-export-import downloads a full backup and restores it in a fresh real workspace', async ({ page }) => {
  await page.goto('/demo/');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  const file = await download;
  const body = await readFile(await file.path(), 'utf8');
  expect(JSON.parse(body).clips[0].title).toBe('French greeting');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.locator('#backup-file').setInputFiles({ name: 'audio-gap-loop-backup.json', mimeType: 'application/json', buffer: Buffer.from(body) });
  await expect(page.getByRole('heading', { name: 'French greeting' })).toBeVisible();
});

test('@claim:local-only-storage keeps an imported clip in this browser and sends no third-party request', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  await importFixture(page);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'My practice phrase' })).toBeVisible();
  expect(requests.every(url => ['blob:', origin].some(allowed => url.startsWith(allowed)))).toBe(true);
});

test('@claim:delete-local-clip removes a clip and its local history', async ({ page }) => {
  await page.goto('/');
  await importFixture(page);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('No practice clips yet')).toBeVisible();
  const counts = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const request = indexedDB.open('audio-gap-loop'); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    const transaction = db.transaction(['clips', 'logs']);
    const clips = await new Promise<number>((resolve, reject) => { const request = transaction.objectStore('clips').count(); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    const logs = await new Promise<number>((resolve, reject) => { const request = transaction.objectStore('logs').count(); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    db.close(); return { clips, logs };
  });
  expect(counts).toEqual({ clips: 0, logs: 0 });
});

test('all routes expose complete metadata, the shared shell, and no axe violations', async ({ page }) => {
  for (const route of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page).toHaveTitle(/Audio Gap Loop/);
    for (const selector of ['link[rel="canonical"]', 'meta[name="theme-color"]', 'meta[property="og:url"]', 'meta[property="og:image"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]', 'meta[name="twitter:image"]', 'link[rel="apple-touch-icon"]']) await expect(page.locator(selector)).toHaveCount(1);
    for (const name of ['Demo', 'How it works', 'Privacy']) await expect(page.locator('header nav').getByRole('link', { name })).toHaveCount(1);
    for (const name of ['Privacy', 'Terms', 'Help']) await expect(page.locator('footer').getByRole('link', { name })).toHaveCount(1);
    await expect(page.locator('footer')).toContainText('Built by Param Factory');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  }
});

test('root has no demo banner, first-screen facts fit, targets are 44px, and Back focuses the destination heading', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.locator('#demo-banner')).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    for (const text of ['Opens a spoken French greeting with a 3-second speaking gap.', 'Sample data stays separate from your clips.', 'Audio stays in this browser.', 'Export a backup before clearing browser data.']) {
      const box = await page.getByText(text, { exact: true }).boundingBox();
      expect(box && box.y + box.height <= viewport.height).toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page.getByRole('heading', { name: 'Privacy information' })).toBeFocused();
  await page.goBack();
  await expect(page.getByRole('heading', { name: /Practise a language clip/i })).toBeFocused();
  for (const selector of ['footer a']) {
    const boxes = await page.locator(selector).evaluateAll(elements => elements.map(element => { const box = (element as HTMLElement).getBoundingClientRect(); return { width: box.width, height: box.height }; }));
    for (const box of boxes) expect(box.width >= 44 || box.height >= 44).toBe(true);
  }
  await page.goto('/demo/');
  for (const selector of ['#demo-banner button', '[data-cadence="repetitions"]']) {
    const boxes = await page.locator(selector).evaluateAll(elements => elements.map(element => { const box = (element as HTMLElement).getBoundingClientRect(); return { width: box.width, height: box.height }; }));
    for (const box of boxes) expect(box.width >= 44 || box.height >= 44).toBe(true);
  }
  await page.goto('/404.html');
  const recovery = await page.locator('.recovery-link').boundingBox();
  expect(recovery && (recovery.width >= 44 || recovery.height >= 44)).toBe(true);
});
