import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pwa-home',
  template: `
    <div class="content">
      <h3>home works!</h3>

      <p>Send a message</p>
      <md-input-container>
        <input mdInput placeholder="Phone" [(ngModel)]="message.phone" type="tel">
      </md-input-container>
      <md-input-container>
        <input mdInput placeholder="Message" [(ngModel)]="message.body">
      </md-input-container>
      <button md-raised-button color="accent" (click)="sendMessages()" [disabled]="!isValidMessage()">Send Messages</button>
    </div>
  `
})
export class HomeComponent implements OnInit {
  message: { phone: string, body: string } = { phone: undefined, body: undefined };

  constructor() { }

  ngOnInit() { }

  isValidMessage() {
    return (this.message && this.message.phone && this.message.body);
  }

  sendMessages() {
    if (this.isValidMessage()) {
      addToOutbox(this.message)
        .then(msg => navigator.serviceWorker.ready)
        .then(reg => registerSyncEvent(reg))
        .catch(() => sendMessage(this.message))
        .catch(err => console.log('unable to send messages to server', err));
    }
  }
}

declare var idbKeyval;

const key = 'pwa-messages';

function addToOutbox(message) {
  return idbKeyval.get(key)
    .then(data => addMessageToArray(data, message))
    .then(messages => idbKeyval.set(key, JSON.stringify(messages)))
}

function addMessageToArray(data, message) {
  data = data || '[]';
  const messages = JSON.parse(data) || [];
  messages.push(message);
  return messages;
}

function removeLastMessageFromOutBox() {
  return getMessagesFromOutbox()
    .then(messages => messages.pop())
    .then(messages => idbKeyval.set(key, JSON.stringify(messages)))
    .then(() => console.log('message removed from outbox'))
    .catch(err => console.log('unable to remove message from outbox', err));
}

function getMessagesFromOutbox() {
  return idbKeyval.get(key).then(values => {
    values = values || '[]';
    const messages = JSON.parse(values) || [];
    return messages;
  });
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
  return fetch('/messages', msg).then(response => {
    console.log('message sent!', message);
    return response.json();
  }).then(() => removeLastMessageFromOutBox())
    .catch(err => console.log('server unable to handle the message', message, err))
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
