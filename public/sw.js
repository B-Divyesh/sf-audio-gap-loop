const CACHE_NAME = 'audio-gap-loop-shell-v3';
const CORE = [
  '/',
  '/offline.html',
  '/privacy/',
  '/terms/',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/assets/patient-tape-deck-720.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE);
    const home = await cache.match('/');
    if (home) {
      const html = await home.text();
      const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
      await Promise.allSettled(assets.map((asset) => cache.add(asset)));
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    const isUpdate = names.some((name) => name.startsWith('audio-gap-loop-shell-') && name !== CACHE_NAME);
    await Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)));
    await self.clients.claim();
    if (isUpdate) {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.postMessage({ type: 'SW_UPDATED' }));
    }
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
        return response;
      } catch {
        return (await caches.match(event.request)) || (await caches.match('/')) || caches.match('/offline.html');
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch {
      return Response.error();
    }
  })());
});

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'CHECK_CONNECTIVITY' || !event.ports[0]) return;
  event.waitUntil((async () => {
    try {
      const response = await fetch(`/manifest.webmanifest?network-check=${Date.now()}`, { cache: 'no-store' });
      event.ports[0].postMessage({ online: response.ok });
    } catch {
      event.ports[0].postMessage({ online: false });
    }
  })());
});
