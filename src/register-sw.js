function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function (registration) {

      swLog('Registration successful', registration);

      registration.onupdatefound = function () {
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
    }).catch(function (e) {
      console.error('Error during service worker registration:', e);
    });
  }

  function swLog(eventName, event?) {
    console.log('Service Worker - ' + eventName);
    if (event) {
      console.log(event);
    }
  }
}
