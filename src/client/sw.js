// https://developers.google.com/web/fundamentals/getting-started/primers/service-workers

// ------------------------------
// Pre Cache and Update
// ------------------------------
importScripts('./workbox-sw.prod.v2.0.0.js');

/**
 * Create an instance of WorkboxSW.
 * Setting clientsClaims to true tells our service worker to take control as
 * soon as it's activated.
 */
const workboxSW = new WorkboxSW({ clientsClaim: true });

/**
 * precache() is passed a manifest of URLs and versions, and does the following
 * each time the service worker starts up:
 *   - Adds all new URLs to a cache.
 *   - Refreshes the previously cached response if the URL isn't new, but the
 *     revision changes. This will also trigger a Broadcast Channel API message
 *     sent to the channel 'precache-updates'.
 *   - Removes entries for URLs that used to be in the list, but aren't anymore.
 *   - Sets up a fetch handler to respond to any requests for URLs in this
 *     list using a cache-first strategy.
 *
 * DO NOT CREATE OR UPDATE THIS LIST BY HAND!
 * Instead, add one of our tools (workbox-cli, workbox-webpack-plugin, or
 * workbox-build) to your existing build process, and have that regenerate the
 * manifest at the end of every build.
 */

// An array of file details include a `url` and `revision` parameter.
workboxSW.precache([]);

/**
 * Requests for URLs that aren't precached can be handled by runtime caching.
 * Workbox has a flexible routing system, giving you control over which caching
 * strategies to use for which kind of requests.
 *
 * registerRoute() takes a RegExp or a string as its first parameter.
 *   - RegExps can match any part of the request URL.
 *   - Strings are Express-style routes, parsed by
 *     https://github.com/nightwolfz/path-to-regexp
 *
 * registerRoute() takes a caching strategy as its second parameter.
 * The built-in strategies are:
 *   - cacheFirst
 *   - cacheOnly
 *   - networkFirst
 *   - networkOnly
 *   - staleWhileRevalidate
 * Advice about which strategies to use for various assets can be found at
 * https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/
 *
 * Each strategy can be configured with additional options, controlling the
 * name of the cache that's used, cache expiration policies, which response
 * codes are considered valid (useful when you want to cache opaque responses)
 * and whether updates to previously cached responses should trigger a message
 * using the BroadcastChannel API.
 *
 * The following routes show this flexibility put to use.
 */

/**
 * Set up a route that will match any URL requested that ends in .json.
 * Handle those requests using a network-first strategy.
 */
// workboxSW.router.registerRoute(
//   /\.json$/,
//   workboxSW.strategies.networkFirst()
// );

/**
 * Set up a route that will match any URL requested that has /api/ in it.
 * Handle those requests using a network-first strategy, but with a timeout.
 * If there's no network response before the timeout, then return the previous
 * response from the cache instead.
 */

workboxSW.router.registerRoute(
  /\/api\/(.*)/,
  // workboxSW.strategies.networkFirst({ networkTimeoutSeconds: 1 })
  workboxSW.strategies.cacheFirst({ cacheName: 'hero-api' })
);

// don't need this since we have fallback
// const networkFirstStrategy = workboxSW.strategies.networkFirst();
// workboxSW.router.registerRoute('/home/', networkFirstStrategy);
// workboxSW.router.registerRoute('/heroes/', networkFirstStrategy);
// workboxSW.router.registerRoute('/villains/', networkFirstStrategy);

/**
 * This URL will be used as a fallback if a navigation request can't be fulfilled.
 * Normally this URL would be precached so it's always available.
 * This is particularly useful for single page apps where requests should go to a single URL.
 */
workboxSW.router.registerNavigationRoute('/index.html');












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

// const applicationServerPublicKey = 'BMZuj1Uek9SeT0myecw8TQxr4dB6Vl4X7c4abMzAA4KR72DsKnVcSpZr6svYgkwNSerKsz7vdZ1kfzwFc0TmH3o';
const applicationServerPublicKey =
  'BNKV7LJ5IFajn46I7FWroeSCMKtyOQPAGguMCn_-mVfyVjr_pvvQn0lW_KMoOAMqEAd4qhFHZhG6GEsDTPSJJ8I';

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
