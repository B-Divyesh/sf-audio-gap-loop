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
  await page.getByLabel('Audio clip title').fill('My practice phrase');
  await page.getByLabel('Transcript (one phrase per line)').fill('Bonjour.\nMerci.');
  await page.getByLabel('I have permission to use this audio.').check();
  await page.getByRole('button', { name: 'Save audio clip' }).click();
  await expect(page.getByRole('heading', { name: 'My practice phrase' })).toBeVisible();
}

async function completeTwoRepeatPractice(page: import('@playwright/test').Page): Promise<void> {
  await page.getByRole('button', { name: 'Merci.' }).click();
  await expect(page.getByRole('button', { name: 'Merci.' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByLabel('Speaking gap between repeats').selectOption('1');
  const repeats = page.getByRole('spinbutton', { name: 'Repeats' });
  await repeats.fill('2');
  await repeats.dispatchEvent('change');
  await expect(repeats).toHaveValue('2');
  await page.getByRole('button', { name: 'Start timed repeats' }).click();
  await expect(page.locator('#phase-label')).toHaveText('Listen');
  await expect(page.locator('#phase-label')).toContainText('Your turn', { timeout: 5_000 });
  await expect(page.locator('#phase-label')).toHaveText('Listen', { timeout: 5_000 });
  await expect(page.locator('#phase-label')).toHaveText('Timed repeats complete', { timeout: 5_000 });
  await expect(page.locator('.history-list')).toContainText('2 repeats');
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
  await expect(page.getByRole('spinbutton', { name: 'Repeats' })).toHaveValue('3');
  await expect(page.locator('.history-list')).toContainText('3 repeats');
  await page.getByRole('button', { name: 'Start timed repeats' }).click();
  await expect(page.locator('.phase-step.active')).toContainText('Listen');
  await expect(page.locator('#phase-label')).toContainText('Your turn', { timeout: 10_000 });
});

test('@claim:real-timed-repeats imports audio, selects a transcript line, leaves a speaking gap, and plays it again', async ({ page }) => {
  await page.goto('/');
  await importFixture(page);
  await completeTwoRepeatPractice(page);
});

test('the direct ?demo=1 route enters the same isolated sample with demo metadata', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Audio Gap Loop');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://audio-gap-loop.sociobot.in/demo/');
  await expect(page.locator('#demo-banner')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start for real' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'French greeting' })).toBeVisible();
  await page.getByLabel('Speaking gap between repeats').selectOption('7');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Speaking gap between repeats')).toHaveValue('3');
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map(database => database.name));
  expect(databases).toContain('demo:audio-gap-loop');
  expect(databases).not.toContain('audio-gap-loop');
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

test('@claim:offline-reload reloads the demo and an imported audio clip while offline after the first visit', async ({ page, context }) => {
  await page.goto('/');
  await importFixture(page);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.goto('/demo/');
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('Offline. The player and saved audio clips are available.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'French greeting' })).toBeVisible();
  await context.setOffline(false);
  await page.goto('/');
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('Offline. The player and saved audio clips are available.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'My practice phrase' })).toBeVisible();
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

test('@claim:local-only-storage keeps imported audio and practice history in this browser without third-party requests', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  await importFixture(page);
  await completeTwoRepeatPractice(page);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'My practice phrase' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Merci.' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByLabel('Speaking gap between repeats')).toHaveValue('1');
  await expect(page.getByRole('spinbutton', { name: 'Repeats' })).toHaveValue('2');
  await expect(page.locator('.history-list')).toContainText('2 repeats');
  expect(requests.every(url => ['blob:', origin].some(allowed => url.startsWith(allowed)))).toBe(true);
  const runtimeSource = await readFile('src/main.ts', 'utf8');
  expect(runtimeSource).not.toMatch(/\b(?:gtag|google-analytics|plausible|posthog|mixpanel|sendBeacon)\b/i);
});

test('@claim:delete-local-clip removes an audio clip and its existing local practice history', async ({ page }) => {
  await page.goto('/');
  await importFixture(page);
  const repeats = page.getByRole('spinbutton', { name: 'Repeats' });
  await repeats.fill('1');
  await repeats.dispatchEvent('change');
  await page.getByRole('button', { name: 'Start timed repeats' }).click();
  await expect(page.locator('#phase-label')).toHaveText('Timed repeats complete', { timeout: 5_000 });
  await expect(page.locator('.history-list')).toContainText('1 repeat');
  const before = await recordCounts(page);
  expect(before).toEqual({ clips: 1, logs: 1 });
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('No audio clips yet')).toBeVisible();
  expect(await recordCounts(page)).toEqual({ clips: 0, logs: 0 });
});

async function recordCounts(page: import('@playwright/test').Page): Promise<{ clips: number; logs: number }> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const request = indexedDB.open('audio-gap-loop'); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    const transaction = db.transaction(['clips', 'logs']);
    const clips = await new Promise<number>((resolve, reject) => { const request = transaction.objectStore('clips').count(); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    const logs = await new Promise<number>((resolve, reject) => { const request = transaction.objectStore('logs').count(); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    db.close(); return { clips, logs };
  });
}

test('@claim:product-boundaries exposes no scoring, lesson, analytics, or advertising feature', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'What this player does not do' })).toBeVisible();
  await expect(page.getByText('It does not score speech or provide lessons.')).toBeVisible();
  const interactiveNames = await page.locator('button, a, input, select, textarea').evaluateAll(elements => elements.map(element => `${element.getAttribute('aria-label') ?? ''} ${element.textContent ?? ''}`));
  expect(interactiveNames.every(name => !/score speech|start lesson|hearing test|pronunciation assessment|advert/i.test(name))).toBe(true);
  expect(requests.every(url => url.startsWith(origin))).toBe(true);
});

test('@claim:artwork-provenance verifies the disclosed cassette artwork source', async ({ page }) => {
  const provenance = JSON.parse(await readFile('assets/src/patient-tape-deck.json', 'utf8')) as { generator: string; deployment: string; prompt: string; review: string };
  expect(provenance.generator).toBe('/opt/fleet/lib/gen-image.sh');
  expect(provenance.deployment).toBe('factory-image');
  expect(provenance.prompt).toContain('cassette-era study desk');
  expect(provenance.review).toContain('Accepted');
  const response = await page.goto('/assets/patient-tape-deck-720.webp');
  expect(response?.ok()).toBe(true);
  await page.goto('/');
  await expect(page.locator('footer')).toContainText('Cassette artwork was generated for this product.');
});

test('@claim:static-build produces the complete static route artifact', async () => {
  for (const file of ['dist/index.html', 'dist/demo/index.html', 'dist/privacy/index.html', 'dist/terms/index.html', 'dist/404.html', 'dist/staticwebapp.config.json']) {
    expect((await readFile(file)).byteLength, file).toBeGreaterThan(0);
  }
});

test('all routes expose complete metadata, the shared mobile shell, working links, and no axe violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page).toHaveTitle(/Audio Gap Loop/);
    for (const selector of ['link[rel="canonical"]', 'meta[name="theme-color"]', 'meta[property="og:url"]', 'meta[property="og:image"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]', 'meta[name="twitter:image"]', 'link[rel="apple-touch-icon"]']) await expect(page.locator(selector)).toHaveCount(1);
    for (const name of ['Demo', 'How it works', 'Privacy']) await expect(page.locator('header nav').getByRole('link', { name })).toBeVisible();
    for (const name of ['Privacy', 'Terms', 'Help']) await expect(page.locator('footer').getByRole('link', { name })).toHaveCount(1);
    await expect(page.locator('footer')).toContainText('Built by Param Factory');
    const internalLinks = await page.locator('a[href^="/"]').evaluateAll(links => [...new Set(links.map(link => (link as HTMLAnchorElement).href))]);
    for (const href of internalLinks) {
      const response = await page.request.get(href);
      expect(response.status(), `${route} links to ${href}`).toBeLessThan(400);
    }
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
    for (const text of ['Opens a spoken French greeting with a 3-second speaking gap.', 'Sample data stays separate from your audio clips.', 'Audio and practice history stay in this browser.', 'Saved audio clips work offline after the first visit.']) {
      const box = await page.getByText(text, { exact: true }).boundingBox();
      expect(box && box.y + box.height <= viewport.height).toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page.getByRole('heading', { name: 'Privacy information' })).toBeFocused();
  await page.goBack();
  await expect(page.getByRole('heading', { name: /Practise an audio clip/i })).toBeFocused();
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

test('keyboard controls start, pause, and restart timed repeats', async ({ page }) => {
  await page.goto('/demo/');
  await page.locator('h1').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#phase-label')).toHaveText('Listen');
  await page.keyboard.press('Space');
  await expect(page.locator('#phase-label')).toHaveText('Paused');
  await page.keyboard.press('r');
  await expect(page.locator('#phase-label')).toHaveText('Listen');
});

test('text resized to 200% stays inside the mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await expect(page.getByRole('link', { name: 'Try sample practice' })).toBeVisible();
});
