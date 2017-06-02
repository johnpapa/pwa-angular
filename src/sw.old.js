// https://developers.google.com/web/fundamentals/getting-started/primers/service-workers

//------------------------------
// Pre Cache and Update, custom style
//------------------------------

var CACHE = 'starwars-api-site-cache-v1';
var urlsToCache = [
  '/',
  '/index.html',
  '/0.chunk.js',
  '/1.chunk.js',
  '/styles.bundle.js',
  '/inline.bundle.js',
  '/polyfills.bundle.js',
  '/vendor.bundle.js',
  '/main.bundle.js'
];

self.addEventListener('install', function (event) {
  // Open a cache and use addAll() with an array of assets to add all
  // of them to the cache. Ask the service worker to keep installing
  // until the returning promise resolves.
  event.waitUntil(caches.open(CACHE).then(function (cache) {
    console.log('Opened cache');
    return cache.addAll(urlsToCache);
  }));
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        swLog('found in cache', response);
        return response;
      }
      swLog('not found in cache, will fetch', event.request);

      // IMPORTANT: Clone the request. A request is a stream and
      // can only be consumed once. Since we are consuming this
      // once by cache and once by the browser for fetch, we need
      // to clone the response.
      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(
        function (response) {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            swLog('fetch was invalid', response);
            return response;
          }
          swLog('fetch was valid', response);

          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have two streams.
          var responseToCache = response.clone();

          caches.open(CACHE)
            .then(function (cache) {
              swLog('putting in cache', { request: event.request, response: responseToCache })
              cache.put(event.request, responseToCache);
            });

          return response;
        }
      ).catch(function (error) {
        console.error('fetch failed', error);
      });
    })
  );
});

self.addEventListener('activate', function (event) {
  // Let's say we have one cache called 'my-site-cache-v1',
  // and we find that we want to split this out into one cache for
  // pages and one cache for blog posts.This means in the install
  // step we'd create two caches, 'starwars-api-site-cache-v1' and 'some-other-posts-cache - v1'
  // and in the activate step we'd want to delete our older 'my-site-cache-v1'.
  //
  // The following code would do this by looping through all of the
  // caches in the service worker and deleting any caches that
  // aren't defined in the cache whitelist.
  var cacheWhitelist = ['starwars-api-site-cache-v1', 'some-other-posts-cache-v1'];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

function swLog(eventName, event) {
  console.log('Service Worker - ' + eventName);
  if (event) {
    console.log(event);
  }
}
