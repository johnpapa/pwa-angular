import { Component, OnInit } from '@angular/core';

declare var idbKeyval;
declare var Notification;
const key = 'pwa-messages';
const applicationServerPublicKey =
  'BMZuj1Uek9SeT0myecw8TQxr4dB6Vl4X7c4abMzAA4KR72DsKnVcSpZr6svYgkwNSerKsz7vdZ1kfzwFc0TmH3o';

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
      <div>
        <p>Receive Push Messages</p>
        <button md-raised-button color="accent" (click)="subscribeClick()" [disabled]="disablePushButton">{{pushButtonText}}</button>
        <p><a href="https://web-push-codelab.appspot.com/" target="_blank" rel="noopener">Go here</a>
         to get a key, then restart the app and send a push
        </p>
        <pre><code>{{subscriptionJson | json}}</code></pre>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  private isSubscribed = false;
  private registration = undefined;

  disablePushButton = false;
  pushButtonText = '';
  subscriptionJson = '';
  message: { phone: string; body: string } = {
    phone: undefined,
    body: undefined
  };

  constructor() {}

  ngOnInit() {
    this.setupPush();
  }

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

  // private registerPeriodicSyncEvent(reg) {
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

  private setupPush() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        this.registration = reg;
        this.initializeUI();
        console.log('Service Worker and Push is supported');
      });
    } else {
      console.warn('Push messaging is not supported');
      this.pushButtonText = 'Push Not Supported';
    }
  }

  subscribeClick() {
    this.disablePushButton = true;
    if (this.isSubscribed) {
      this.unsubscribeUser();
    } else {
      this.subscribeUser();
    }
  }

  private initializeUI() {
    // Set the initial subscription value
    this.registration.pushManager.getSubscription().then(subscription => {
      this.isSubscribed = !(subscription === null);

      this.updateSubscriptionOnServer(subscription);

      if (this.isSubscribed) {
        console.log('User IS subscribed.');
      } else {
        console.log('User is NOT subscribed.');
      }

      this.updateBtn();
    });
  }

  private unsubscribeUser() {
    this.registration.pushManager
      .getSubscription()
      .then(subscription => {
        if (subscription) {
          return subscription.unsubscribe();
        }
      })
      .catch(error => {
        console.log('Error unsubscribing', error);
      })
      .then(() => {
        this.updateSubscriptionOnServer(null);

        console.log('User is unsubscribed.');
        this.isSubscribed = false;

        this.updateBtn();
      });
  }

  private urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  subscribeUser() {
    const applicationServerKey = this.urlB64ToUint8Array(
      applicationServerPublicKey
    );
    this.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      })
      .then(subscription => {
        console.log('User is subscribed.');

        this.updateSubscriptionOnServer(subscription);

        this.isSubscribed = true;

        this.updateBtn();
      })
      .catch(err => {
        console.log('Failed to subscribe the user: ', err);
        this.updateBtn();
      });
  }

  private updateSubscriptionOnServer(subscription) {
    // TODO: Send subscription to application server

    if (subscription) {
      this.subscriptionJson = subscription;
    } else {
      this.subscriptionJson = '';
    }
  }

  private updateBtn() {
    if (Notification.permission === 'denied') {
      this.pushButtonText = 'Push Messaging Blocked.';
      this.disablePushButton = true;
      this.updateSubscriptionOnServer(null);
      return;
    }

    if (this.isSubscribed) {
      this.pushButtonText = 'Disable Push Messaging';
    } else {
      this.pushButtonText = 'Enable Push Messaging';
    }

    this.disablePushButton = false;
  }
}
