import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pwa-home',
  template: `
    <div class="content">
      <div>home works!</div>

      <md-input-container>
        <input mdInput placeholder="Phone" [(ngModel)]="message.phone" type="tel">
      </md-input-container>
      <md-input-container>
        <input mdInput placeholder="Message" [(ngModel)]="message.body">
      </md-input-container>
      <button md-raised-button color="accent" (click)="sendMessages()" [disabled]="!isValidMessage()">Send Messages</button>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  private i = 0;
  message: { phone: string, body: string } = { phone: undefined, body: undefined };

  constructor() { }

  ngOnInit() { }

  isValidMessage() {
    return (this.message && this.message.phone && this.message.body);
  }

  sendMessages() {
    if (this.isValidMessage()) {
      addToOutbox(this.message)
        .then((msg) => navigator.serviceWorker.ready)
        .then((reg) => registerSyncEvent(reg))
        .catch(() => sendMessagesToServer(this.message));
    }
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
  return idbKeyval.get(key).then(data => {
    data = data || '[]';
    const messages = JSON.parse(data) || [];
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
