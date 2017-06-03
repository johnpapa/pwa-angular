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
    const message = `Message # ${this.i++}`
    addToOutBox(message)
      .then(() => navigator.serviceWorker.ready)
      .then((reg) => registerSyncEvent(reg))
      .catch(() => sendMessagesToServer(message));
  }
}

function addToOutBox(message) {
  console.log('message added to outbox', message);
  return Promise.resolve(message);
}

function sendMessagesToServer(messages) {
  console.log('messages sent!', messages);
  return Promise.resolve({ msg: 'messages sent!', data: messages });
}

function registerSyncEvent(reg) {
  console.log('sync registered for send-messages');
  return reg.sync.register('mySync');
}


