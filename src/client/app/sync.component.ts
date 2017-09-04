import { Component, OnInit } from '@angular/core';

declare var idbKeyval;
const key = 'pwa-messages';

@Component({
  selector: 'pwa-sync',
  template: `
      <div>
        <p>Send a message</p>
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
export class SyncComponent implements OnInit {
  message: { phone: string; body: string } = {
    phone: undefined,
    body: undefined
  };

  constructor() {}

  ngOnInit() {}

  isValidMessage() {
    return this.message && this.message.phone && this.message.body;
  }

  sendMessages() {
    if (this.isValidMessage()) {
      this.addToOutbox(this.message)
        .then(msg => navigator.serviceWorker.ready)
        .then(reg => this.registerSyncEvent(reg))
        .catch(() => this.sendMessage(this.message))
        .catch(err => console.log('unable to send messages to server', err));
    }
  }

  private addToOutbox(message) {
    return idbKeyval
      .get(key)
      .then(data => this.addMessageToArray(data, message))
      .then(messages => idbKeyval.set(key, JSON.stringify(messages)));
  }

  private addMessageToArray(data, message) {
    data = data || '[]';
    const messages = JSON.parse(data) || [];
    messages.push(message);
    return messages;
  }

  private removeLastMessageFromOutBox() {
    return this.getMessagesFromOutbox()
      .then(messages => messages.pop())
      .then(messages => idbKeyval.set(key, JSON.stringify(messages)))
      .then(() => console.log('message removed from outbox'))
      .catch(err => console.log('unable to remove message from outbox', err));
  }

  private getMessagesFromOutbox() {
    return idbKeyval.get(key).then(values => {
      values = values || '[]';
      const messages = JSON.parse(values) || [];
      return messages;
    });
  }

  private sendMessage(message) {
    const headers = {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    };
    const msg = {
      method: 'POST',
      body: JSON.stringify(message),
      headers: headers
    };
    return fetch('/messages', msg)
      .then(response => {
        console.log('message sent!', message);
        return response.json();
      })
      .then(() => this.removeLastMessageFromOutBox())
      .catch(err =>
        console.log('server unable to handle the message', message, err)
      );
  }

  private registerSyncEvent(reg) {
    return reg.sync
      .register('my-pwa-messages')
      .then(() => console.log('Sync - registered for my-pwa-messages'))
      .catch(() => console.log('Sync - registration failed'));
  }
}
