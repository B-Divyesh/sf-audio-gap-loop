import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const publicCopy = ['../index.html', '../demo/index.html', '../privacy/index.html', '../terms/index.html', '../404.html', '../README.md', '../src/main.ts', '../.factory/catalog-description.txt']
  .map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'))
  .join('\n');
const catalogDescription = readFileSync(new URL('../.factory/catalog-description.txt', import.meta.url), 'utf8').trim();

describe('public terminology', () => {
  it('uses audio clip as the only name for imported audio', () => {
    expect(publicCopy.toLowerCase()).not.toMatch(/\b(?:language|practice|sample) clips?\b/);
    for (const outdated of ['>current clip<', '>clip title<', 'save clip locally', 'no practice clips', 'calm listen']) expect(publicCopy.toLowerCase(), outdated).not.toContain(outdated);
  });

  it('includes the required privacy and product-limits section', () => {
    expect(publicCopy).toContain('What this player does not do');
    expect(publicCopy).toContain('It does not score speech or provide lessons.');
    expect(publicCopy).toContain('Audio clips and practice history stay in this browser.');
  });

  it('keeps the catalog description verb-first and within 120 characters', () => {
    expect(catalogDescription).toMatch(/^Practise\b/);
    expect(catalogDescription.length).toBeLessThanOrEqual(120);
  });
});
