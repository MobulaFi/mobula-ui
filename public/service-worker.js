const cacheName = "mobula-cache-v1";
const filesToCache = ["mobula", "emotes", "icon", "logo", "asset"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(["/"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  let shouldCache =
    !!event.request.url.startsWith("chrome-extension:") &&
    (event.request.url.endsWith(".css") ||
      event.request.url.endsWith(".js") ||
      event.request.url.endsWith(".woff2"));

  if (!shouldCache && event.request.url.endsWith(".png")) {
    const url = new URL(event.request.url);
    shouldCache = filesToCache.some((folder) =>
      url.pathname.includes(`/${folder}/`)
    );
  }

  if (shouldCache) {
    try {
      event.respondWith(
        caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }

          var fetchRequest = event.request.clone();

          return fetch(fetchRequest).then((response) => {
            if (
              !response ||
              response.status !== 200 ||
              response.type !== "basic"
            ) {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(cacheName).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return response;
          });
        })
      );
    } catch (e) {
      // silent
    }
  }
});
