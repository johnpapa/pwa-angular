import { Component, OnInit } from '@angular/core';

declare var idbKeyval;
declare var Notification;
const key = 'pwa-messages';
const applicationServerPublicKey = 'BMZuj1Uek9SeT0myecw8TQxr4dB6Vl4X7c4abMzAA4KR72DsKnVcSpZr6svYgkwNSerKsz7vdZ1kfzwFc0TmH3o';

@Component({
  selector: 'pwa-home',
  template: `
    <div class="content">
      <h3>home works!</h3>

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
    </div>
  `
})
export class HomeComponent implements OnInit {
  private isSubscribed = false;
  private registration = undefined;

  message: { phone: string, body: string } = { phone: undefined, body: undefined };

  constructor() { }

  ngOnInit() {
  }

  isValidMessage() {
    return (this.message && this.message.phone && this.message.body);
  }

  sendMessages() {
    if (this.isValidMessage()) {
      this.sendMessage(this.message)
        .catch(err => console.log('unable to send messages to server', err));
    }
  }

  private sendMessage(message) {
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
    })
      .catch(err => console.log('server unable to handle the message', message, err))
  }
}
