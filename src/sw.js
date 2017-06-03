// https://developers.google.com/web/fundamentals/getting-started/primers/service-workers

//------------------------------
// Pre Cache and Update
//------------------------------

var CACHE = 'starwars-api-site-cache-v1';
var URLS_TO_CACHE = [
  '/',
  '/offline.html',
  '/0.chunk.js',
  '/1.chunk.js',
  '/styles.bundle.js',
  '/inline.bundle.js',
  '/polyfills.bundle.js',
  '/vendor.bundle.js',
  '/main.bundle.js'
];

self.addEventListener('install', function (event) {
  // We can kick the old version ou,
  // but then we're controlling a page loaded
  // with an older version of a service worker.
  // But instead, use Update on Reload for development
  // self.skipWaiting();

  // Ask the service worker to keep installing
  // until the returning promise resolves.
  event.waitUntil(preCache());
});

// Open a cache and use addAll() with an array of assets
// to add all of them to the cache.
// Return a promise resolving when all the assets are added.
function preCache() {
  return caches.open(CACHE).then(function (cache) {
    console.log('Opening cache and adding the following URLs to it', URLS_TO_CACHE);
    return cache.addAll(URLS_TO_CACHE);
  });
}

// On fetch, use cache but update the entry
// with the latest contents from the server.
self.addEventListener('fetch', function (event) {
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
    console.log('trying to match', request);
    return cache.match(request).then(function (matching) {
      // The match() method of the Cache interface returns a Promise
      // that resolves to the Response associated with the
      // first matching request in the Cache object.
      // If no match is found, the Promise resolves to undefined.
      if (matching) {
        swLog('found a match', matching);
        return matching; // || Promise.reject('no-match');
      } else {
        swLog('match not found. request mode ===  ' + request.mode);
        if (request.mode === 'navigate') {
          swLog('return offline html');
          return caches.match('/offline.html');
        }
        swLog('no match found and not navigating, so we return undefined');
      }
    })
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
  swLog('activate event fired', event);
  // Let's say we have one cache called 'my-site-cache-v1',
  // and we find that we want to split this out into one cache for
  // pages and one cache for blog posts.This means in the install
  // step we'd create two caches, 'starwars-api-site-cache-v1' and 'some-other-posts-cache - v1'
  // and in the activate step we'd want to delete our older 'my-site-cache-v1'.
  //
  // The following code would do this by looping through all of the
  // caches in the service worker and deleting any caches that
  // aren't defined in the cache whitelist.
  var expectedCaches = [CACHE, 'some-other-cache-v1'];

  // we use waitUntil() to prevent the worker
  // to be killed until the cache is updated.
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(cacheNames.map(function (cacheName) {
        if (!expectedCaches.includes(cacheName)) {
          swLog('deleting cache: ' + cacheName);
          return caches.delete(cacheName);
        }
      }));
    })
  );
});

function swLog(eventName, event) {
  console.log('Service Worker - ' + eventName);
  if (event) {
    console.log(event);
  }
}
