import { Component, OnInit } from '@angular/core';

declare var Notification;
// const applicationServerPublicKey =
//   'BMZuj1Uek9SeT0myecw8TQxr4dB6Vl4X7c4abMzAA4KR72DsKnVcSpZr6svYgkwNSerKsz7vdZ1kfzwFc0TmH3o';
const applicationServerPublicKey =
  'BNKV7LJ5IFajn46I7FWroeSCMKtyOQPAGguMCn_-mVfyVjr_pvvQn0lW_KMoOAMqEAd4qhFHZhG6GEsDTPSJJ8I';

@Component({
  selector: 'pwa-push',
  template: `
      <div>
        <p>Receive Push Messages</p>
        <button md-raised-button color="accent" (click)="subscribeClick()" [disabled]="disablePushButton">{{pushButtonText}}</button>
        <p><a href="https://web-push-codelab.appspot.com/" target="_blank" rel="noopener">Go here</a>
         to get a key, then restart the app and send a push
        </p>
        <pre><code>{{subscriptionJson | json}}</code></pre>
      </div>
  `
})
export class PushComponent implements OnInit {
  private isSubscribed = false;
  private registration = undefined;

  disablePushButton = false;
  pushButtonText = '';
  subscriptionJson = '';

  constructor() {}

  ngOnInit() {
    this.setupPush();
  }

  private setupPush() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        this.registration = reg;
        this.initializeUI();
        console.log('Service Worker and Push is supported');
      });
    } else {
      console.warn('Push messaging is not supported');
      this.disablePushButton = true;
      this.pushButtonText = 'Push Not Supported';
    }
  }

  subscribeClick() {
    this.disablePushButton = true;
    this.isSubscribed ? this.unsubscribeUser() : this.subscribeUser();
  }

  private initializeUI() {
    this.registration.pushManager.getSubscription().then(subscription => {
      this.isSubscribed = !(subscription === null);
      this.updateSubscriptionOnServer(subscription);
      console.log(`User ${this.isSubscribed ? 'IS' : 'is NOT'} subscribed.`);
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
      .catch(error => console.log('Error unsubscribing', error))
      .then(() => {
        this.updateSubscriptionOnServer(null);
        console.log('User is unsubscribed.');
        this.isSubscribed = false;
        this.updateBtn();
      });
  }

  private urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  subscribeUser() {
    const applicationServerKey = this.urlB64ToUint8Array(applicationServerPublicKey);
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
    const url = 'https://node-web-push-app.azurewebsites.net/subscribe';

    if (subscription) {
      subscription = JSON.stringify(subscription);
      this.subscriptionJson = subscription;
      const fetchOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: subscription };
      fetch(url, fetchOptions)
        .then(data => console.log('Push subscription request succeeded with JSON response', data))
        .catch(error => console.log('Push subscription request failed', error));
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

    this.pushButtonText = `${this.isSubscribed ? 'Disable' : 'Enable'}  Push Messaging`;
    this.disablePushButton = false;
  }
}
