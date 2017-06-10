// https://developers.google.com/web/fundamentals/getting-started/primers/service-workers

// ------------------------------
// Pre Cache and Update
// ------------------------------
self.importScripts('manifest.js');

const CACHE = 'pwa-angular-cache-v1';

const ROUTES_TO_CACHE = [
  'home',
  'heroes',
  'villains'
];

const CACHE_MANIFEST = [].concat(ROUTES_TO_CACHE, self.__file_manifest.map(file => file.url));

self.addEventListener('install', event => {
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
  return caches.open(CACHE).then(cache => {
    swLog('Opening cache and adding the following URLs to it', CACHE_MANIFEST);
    return cache.addAll(CACHE_MANIFEST);
  });
}

// On fetch, use cache but update the entry
// with the latest contents from the server.
self.addEventListener('fetch', event => {
  // In "lie-fi" environments, with awfully slow wifi,
  // the user will see the app shell while we load.
  // TODO: Ideally this should be the same shell our app uses.
  // const url = new URL(event.request.url);
  // if (url.origin === location.origin && url.pathname === '/') {
  //   event.respondWith(caches.match('/shell.html'));
  //   return;
  // }

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
  return caches.open(CACHE).then(cache => {
    swLog('trying to match', request);
    return cache.match(request).then(matching => {
      // The match() method of the Cache interface returns a Promise
      // that resolves to the Response associated with the
      // first matching request in the Cache object.
      // If no match is found, the Promise resolves to undefined.
      if (matching) {
        swLog('found a match', matching);
        return matching; // || Promise.reject('no-match');
      } else {
        swLog('match not found. request mode ===  ' + request.mode + ', fetching ...', request);
        return fetch(request).then(response => {
          swLog('updating the cache with ' + request.url);
          const responseClone = response.clone();
          cache.put(request, responseClone);
          return response;
        }).catch(error => {
          swLog('error while fetching', error);
          if (request.mode === 'navigate') {
            swLog('return offline html');
            return caches.match('/offline.html');
          }
          swLog('no match found and not navigating, so we return undefined');
        });
      }
    });
  });
}

// Update opens the cache,
// performs a network request
// and stores the new response data.
function update(request) {
  return caches.open(CACHE).then(cache => {
    return fetch(request).then(response => {
      swLog('updating the cache with ' + request.url);
      return cache.put(request, response);
    });
  });
}

self.addEventListener('activate', event => {
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
  const expectedCaches = [CACHE, 'some-other-cache-v1'];

  // we use waitUntil() to prevent the worker
  // to be killed until the cache is updated.
  event.waitUntil(caches.keys().then(cacheNames => {
    return Promise.all(cacheNames.map(cacheName => {
      if (!expectedCaches.includes(cacheName)) {
        swLog('deleting cache: ' + cacheName);
        return caches.delete(cacheName);
      }
    }));
  }));
});

// -------------------------------------------------------
// background sync
// -------------------------------------------------------
self.importScripts('assets/idb-keyval-min.js');

self.addEventListener('sync', event => {
  swLog('I heard a sync event!', event);
  if (event.tag === 'my-pwa-messages') {
    event.waitUntil(getMessagesFromOutbox()
      .then(messages => Promise.all(mapAndSendMessages(messages)))
      .catch(err => swLog('unable to send messages to server', err))
      .then(response => removeMessagesFromOutBox(response))
    );
  }
});

function getMessagesFromOutbox() {
  const key = 'pwa-messages';
  return idbKeyval.get(key).then(values => {
    values = values || '[]';
    const messages = JSON.parse(values) || [];
    return messages;
  });
}

function mapAndSendMessages(messages) {
  return messages.map(
    message => sendMessage(message)
      .then(response => response.json())
      .catch(err => swLog('server unable to handle the message', message, err))
  );
}

function sendMessage(message) {
  const headers = {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  };
  const msg = {
    method: 'POST',
    body: JSON.stringify(message),
    headers: headers
  };
  return fetch('/messages', msg).then((response) => {
    swLog('message sent!', message);
    return response;
  });
}

function removeMessagesFromOutBox(response) {
  // If the first worked,let's assume for now they all did
  if (response && response.length && response[0] && response[0].result === 'success') {
    return idbKeyval.clear()
      .then(() => swLog('messages removed from outbox'))
      .catch(err => swLog('unable to remove messages from outbox', err));
  }
  return Promise.resolve(true);
}


// -------------------------------------------------------
// push
// -------------------------------------------------------
// https://github.com/web-push-libs/web-push
self.addEventListener('push', event => {
  const body = event.data.text() || 'A little push';
  swLog(`Push received and had this data: "${event.data.text()}"`);

  const title = 'Push Demo';
  const options = {
    body: body,
    icon: 'assets/ng.png',
    badge: 'assets/ng.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  swLog('Notification click Received.');

  event.notification.close();

  // We are calling event.waitUntil() again
  // to ensure the browser doesn't terminate
  // our service worker before our new window has been displayed.
  event.waitUntil(clients.openWindow('https://johnpapa.net'));
});

const applicationServerPublicKey = 'BMZuj1Uek9SeT0myecw8TQxr4dB6Vl4X7c4abMzAA4KR72DsKnVcSpZr6svYgkwNSerKsz7vdZ1kfzwFc0TmH3o';

self.addEventListener('pushsubscriptionchange', event => {
  swLog(`'pushsubscriptionchange' event fired.`);
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
      .then(newSubscription => {
        // TODO: Send to application server
        swLog('New subscription: ', newSubscription);
      })
  );
});



// -------------------------------------------------------
// logging
// -------------------------------------------------------
function swLog(eventName, event) {
  console.log('[Service Worker] ' + eventName);
  if (event) {
    console.log(event);
  }
}
