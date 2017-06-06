import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => registerServiceWorker());

let registration = undefined;

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      registration = reg;
      swLog('Registration successful', registration);

      registration.onupdatefound = () => checkServiceWorkerStateChange();
    })

      // .then(() => {
      //   console.log('navigator.serviceWorker.ready === ', navigator.serviceWorker.ready);
      //   return navigator.serviceWorker.ready;
      // })

      // .then(() => {
      //   console.log('sync registered for send-messages');
      //   return reg => reg.sync.register('send-messages');
      // })

      .catch(e => console.error('Error during service worker registration:', e));

  } else {
    console.warn('Service Worker is not supported');
  }
}

function checkServiceWorkerStateChange() {
  const installingWorker = registration.installing;

  swLog('Update found, now checking the statechange ...', installingWorker.state);

  installingWorker.onstatechange = () => {
    switch (installingWorker.state) {
      case 'installed':
        if (navigator.serviceWorker.controller) {
          swLog('New or updated content is available.');
        } else {
          swLog('Content is now available offline!');
        }
        break;

      case 'redundant':
        console.error('The installing service worker became redundant.');
        break;

      default:
        swLog(installingWorker.state);
        break;
    }
  };
};

function swLog(eventName, event?) {
  console.log('Service Worker - ' + eventName);
  if (event) {
    console.log(event);
  }
}

