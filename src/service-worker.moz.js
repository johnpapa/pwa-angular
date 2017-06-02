// https://developers.google.com/web/fundamentals/getting-started/primers/service-workers

// TODO: not working on deep links

var CACHE = 'starwars-api-site-cache-v1';
var urlsToCache = [
  './',
  './0.chunk.js',
  './1.chunk.js',
  './styles.bundle.js',
  './inline.bundle.js',
  './polyfills.bundle.js',
  './vendor.bundle.js',
  './main.bundle.js'
];

self.addEventListener('install', function (event) {
  // Ask the service worker to keep installing
  // until the returning promise resolves.
  event.waitUntil(precache());
});

// Open a cache and use addAll() with an array of assets
// to add all of them to the cache.
// Return a promise resolving when all the assets are added.
function precache() {
  return caches.open(CACHE).then(function (cache) {
    console.log('Opening cache and adding the following URLs to it', urlsToCache);
    return cache.addAll(urlsToCache);
  });
}

// On fetch, use cache but update the entry with the latest contents
// from the server.
self.addEventListener('fetch', function (event) {
  swLog('serving the asset');

  // Use respondWith() to answer immediately,
  // without waiting for the network response
  // to reach the service worker…
  event.respondWith(fromCache(event.request));

  // Use `waitUntil()` to prevent the worker to be killed
  // until the cache is updated.
  event.waitUntil(update(event.request));
});

// Open the cache where the assets were stored and search for the requested resource.
// Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
function fromCache(request) {
  swLog('searching the cache for ' + request.url);
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

// Update opens the cache,
// performs a network request
// and stores the new response data.
function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      swLog('updating the cache with ' + request.url);
      return cache.put(request, response);
    });
  });
}

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

  // we use waitUntil() to prevent the worker
  // to be killed until the cache is updated.
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
