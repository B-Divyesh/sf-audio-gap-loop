import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const config = JSON.parse(readFileSync(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8')) as {
  globalHeaders: Record<string, string>;
  mimeTypes: Record<string, string>;
  routes: Array<{ route: string; headers: Record<string, string> }>;
};

function routeHeaders(route: string): Record<string, string> {
  const match = config.routes.find((entry) => entry.route === route);
  if (!match) throw new Error(`Missing deployment route ${route}.`);
  return match.headers;
}

describe('static deployment policy', () => {
  it('keeps fingerprinted assets immutable while revalidating the app shell and worker', () => {
    expect(routeHeaders('/assets/*')['Cache-Control']).toBe('public, max-age=31536000, immutable');
    expect(routeHeaders('/sw.js')['Cache-Control']).toContain('no-cache');
    expect(routeHeaders('/manifest.webmanifest')['Cache-Control']).toContain('must-revalidate');
  });

  it('ships the PWA MIME type and response hardening required by the static host', () => {
    expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
    expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(config.globalHeaders['Permissions-Policy']).toContain('camera=()');
    expect(config.globalHeaders['X-Frame-Options']).toBe('DENY');
  });
});
