const CACHE_NAME = "vr-explorer-v2";
const ASSETS_TO_CACHE = [
  "/ExplorerTest4/",
  "/ExplorerTest4/index.html",
  "/ExplorerTest4/manifest.json",
  "/ExplorerTest4/icons/icon-192.png",
  "/ExplorerTest4/icons/icon-512.png",
  "/ExplorerTest4/icons/icon-maskable-192.png",
  "/ExplorerTest4/icons/icon-maskable-512.png"
];

// Install: cache core files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first with cache fallback
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
