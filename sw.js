const CACHE_NAME = "flamme-rouge-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/src/styles.css",
  "/src/app.js",
  "/manifest.json",
  "/icon-192.svg",
  "/icon-512.svg",
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Åbner cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Sletter gammel cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
