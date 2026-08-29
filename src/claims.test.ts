import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface Claim {
  id: string;
  test: string;
}

const claims = JSON.parse(readFileSync(new URL('../.factory/claims.json', import.meta.url), 'utf8')) as Claim[];
const browserTests = readFileSync(new URL('../tests/e2e/app.spec.ts', import.meta.url), 'utf8');

describe('claim contract', () => {
  it('gives every declared claim exactly one tagged outcome test', () => {
    const ids = claims.map((claim) => claim.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const claim of claims) {
      expect(claim.test).toBe(`npm test -- --grep @claim:${claim.id}`);
      expect(browserTests.split(`@claim:${claim.id}`).length - 1, claim.id).toBe(1);
    }
  });

  it('declares every browser claim tag in the inventory', () => {
    const tagged = [...browserTests.matchAll(/@claim:([a-z0-9-]+)/g)].map((match) => match[1]);
    expect(tagged.sort()).toEqual(claims.map((claim) => claim.id).sort());
  });
});
