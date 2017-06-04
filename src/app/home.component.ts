import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pwa-home',
  template: `
    <div class="content">
      home works!
    </div>
    <button md-button (click)="sendMessages()">Send Messages</button>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  private i = 0;

  constructor() { }

  ngOnInit() { }

  sendMessages() {
    const message = `Message # ${this.i++}`;
    addToOutbox(message)
      .then((msg) => navigator.serviceWorker.ready)
      .then((reg) => registerSyncEvent(reg))
      .catch(() => sendMessagesToServer(message));
  }
}

declare var idb;

// async function addToOutbox(message) {
//   return await idb.open('my-pwa-db', 1, upgradeDb => {
//     switch (upgradeDb.oldVersion) {
//       case 0:
//         const store = upgradeDb.createObjectStore('key-val');
//     }
//   }).then(db => {
//     const tx = db.transaction('pwa-messages', 'readwrite');
//     tx.objectStore('pwa-messages').put(message);
//     console.log('message added to outbox', message);
//     return tx.complete;
//   });
// }

declare var idbKeyval;

async function addToOutbox(message) {
  const key = 'pwa-messages';
  return idbKeyval.get(key).then(values => {
    values = values || '[]';
    const messages = JSON.parse(values) || [];
    messages.push(message);
    return messages;
  }).then(messages => idbKeyval.set(key, JSON.stringify(messages)))
    .then((messages) => console.log('message added to outbox', message))
    .catch(err => console.log('unable to store message in outbox', err));
}

function sendMessagesToServer(messages) {
  console.log('messages sent!', messages);
  return Promise.resolve({ msg: 'messages sent!', data: messages });
}

function registerSyncEvent(reg) {
  return reg.sync.register('my-pwa-messages')
    .then(() => console.log('Sync - registered for my-pwa-messages'))
    .catch(() => console.log('Sync - registration failed'));
}

// function registerPeriodicSyncEvent(reg) {
//   console.log('periodic sync registered for my-pwa-messages');
//   const syncSettings = {
//     tag: 'my-pwa-messages',         // default: ''
//     minPeriod: 60 * 1000,           // default: 0
//     powerState: 'avoid-draining',   // default: 'auto'
//     networkState: 'avoid-cellular'  // default: 'online'
//   };
//   return reg.periodicSync.register(syncSettings)
//     .then(() => console.log('Periodic Sync - registered', syncSettings))
//     .catch(() => console.log('Periodic Sync - registration failed'));
// }
