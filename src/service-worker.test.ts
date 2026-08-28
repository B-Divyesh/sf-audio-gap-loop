import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const worker = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');

describe('offline shell updates', () => {
  it('versions the current shell and notifies already-open clients after an update', () => {
    expect(worker).toContain("const CACHE_NAME = 'audio-gap-loop-shell-v4'");
    expect(worker).toContain('await self.skipWaiting()');
    expect(worker).toContain("client.postMessage({ type: 'SW_UPDATED' })");
  });
});
