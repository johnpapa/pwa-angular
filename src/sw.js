// https://developers.google.com/web/fundamentals/getting-started/primers/service-workers

// ------------------------------
// Pre Cache and Update
// ------------------------------
importScripts('./workbox-sw.prod.v1.0.1.js');







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
