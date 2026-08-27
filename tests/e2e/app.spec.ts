import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

function shortWav(): Buffer {
  const sampleRate = 8_000;
  const samples = 1_600;
  const dataSize = samples * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let index = 0; index < samples; index += 1) {
    buffer.writeInt16LE(Math.round(Math.sin(index / 8) * 1200), 44 + index * 2);
  }
  return buffer;
}

test('imports a real clip, persists it, and stays usable offline', async ({ page, context }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /Listen\. Say it\. Check\./i })).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);

  const chooserPromise = page.waitForEvent('filechooser');
  await page.locator('.hero').getByRole('button', { name: 'Add your first clip' }).click();
  const chooser = await chooserPromise;
  await chooser.setFiles({ name: 'bonjour.wav', mimeType: 'audio/wav', buffer: shortWav() });
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByLabel('Transcript (one phrase per line)').fill('Bonjour !\nÀ demain.');
  await page.getByLabel('I have permission to use this audio.').check();
  await page.getByRole('button', { name: 'Save clip locally' }).click();

  await expect(page.locator('.player-shell').getByRole('heading', { name: 'bonjour' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Bonjour !' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'À demain.' }).click();
  await expect(page.getByRole('button', { name: 'À demain.' })).toHaveAttribute('aria-pressed', 'true');

  await page.reload();
  await expect(page.locator('.player-shell').getByRole('heading', { name: 'bonjour' })).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('Offline. Your saved clips and practice tools still work.')).toBeVisible();
  await expect(page.locator('.player-shell').getByRole('heading', { name: 'bonjour' })).toBeVisible();
  await context.setOffline(false);
  expect(consoleErrors).toEqual([]);
});

test('phone layout exposes primary controls without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.hero').getByRole('button', { name: 'Add your first clip' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
