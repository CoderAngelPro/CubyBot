const CACHE = 'cubybot-v1';
const STATIC = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/src/assets/icons/happy_robot.png',
  '/src/assets/icons/happy_robot_192.png',
  '/src/assets/icons/happy_robot_512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(STATIC.map(path => new Request(path, { cache: 'reload' })))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  const isAPI = request.url.includes('/generate') ||
                request.url.includes('/history')  ||
                request.url.includes('/auth/');
  if (isAPI) return;

  event.respondWith(
    caches.match(request).then(
      cached => cached || fetch(request).then(resp => {
        if (resp.status === 200 && request.method === 'GET') {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
        }
        return resp;
      })
    )
  );
});
