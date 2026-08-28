import { describe, expect, it } from 'vitest';
import { checkoutUrl, studioSalesEnabled } from './license';

describe('Studio checkout release gate', () => {
  it('keeps public sales disabled unless the factory explicitly enables checkout', () => {
    expect(studioSalesEnabled()).toBe(false);
    expect(studioSalesEnabled('false')).toBe(false);
    expect(studioSalesEnabled('TRUE')).toBe(false);
    expect(studioSalesEnabled('true')).toBe(true);
  });

  it('continues to use the product-specific Sociobot checkout route when enabled', () => {
    expect(checkoutUrl).toBe('https://api.sociobot.in/api/v1/products/audio-gap-loop/checkout');
  });
});
