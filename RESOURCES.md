## What Can PWAs Do?

When launched from the user’s home screen, service workers enable a Progressive Web App to load instantly, regardless of the network state.

- look and feel like an app
- launch instantly
- send push notifications
- work offline
- icon on the homescreen


## Technology


### App Shell

The App Shell design approach enables the initial load of a mobile web app to provide a basic shell of a app UI, and the content for the app is loaded after.  The App Shell is cached separate from our main app, to enable the shell to load quickly.


### Meta Tags

Links
- [generator icons and meta tags](http://realfavicongenerator.net/)

### App Manifest

We write a manifest.json file that helps enable features.

- icons
- splash screen
- theme colors
- the URL that's opened.

Currently, iOS doesn’t have any additional features here beyond Pin to Homescreen. Chrome on Android added support for installing web apps to the homescreen with a native install banner.

Links
- [App Manifest generator](https://app-manifest.firebaseapp.com/)
- https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
- https://manifest-validator.appspot.com/

Support
- http://caniuse.com/#feat=web-app-manifest


### Service Workers

Service Worker is a worker script that runs in response to events like network requests, push notifications, connectivity changes in the background. A service worker puts you in control of the cache and how to respond to resource requests.

They Power:
- offline functionality
- push notifications
- background content updating
- content caching

Links:
- https://serviceworke.rs/
- https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker
- https://developers.google.com/web/fundamentals/getting-started/primers/service-workers
- https://developers.google.com/web/fundamentals/instant-and-offline/service-worker/lifecycle
- https://jakearchibald.github.io/isserviceworkerready/
- https://w3c.github.io/manifest/#serviceworker-member
- https://coryrylan.com/blog/fast-offline-angular-apps-with-service-workers
- https://serviceworke.rs/caching-strategies.html
- https://developers.google.com/web/tools/workbox/
- https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
- https://bitsofco.de/the-service-worker-lifecycle/

Support
http://caniuse.com/#feat=serviceworkers


### Background Sync

The service worker can send messages in the background.

They Power:
- ability to unblock the user when they want to send data over the network

Links:
- https://developers.google.com/web/updates/2015/12/background-sync
- https://ponyfoo.com/articles/backgroundsync
- https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts
- https://www.twilio.com/blog/2017/02/send-messages-when-youre-back-online-with-service-workers-and-background-sync.html


### Push

The service worker can listen for push notifications.

They Power:
- ability to receive and act upon push notifications in the web
- subscribe and unsbuscribe to the push notifications' server

Links:
- https://serviceworke.rs/push-simple.html
- https://developers.google.com/web/fundamentals/getting-started/codelabs/push-notifications/
- https://github.com/GoogleChrome/push-notifications
- https://github.com/web-push-libs/web-push
- https://developers.google.com/web/ilt/pwa/lab-integrating-web-push
- https://web-push-codelab.appspot.com/


### PWA Resources

- https://serviceworke.rs/
- https://workboxjs.org/
- https://www.smashingmagazine.com/2016/08/a-beginners-guide-to-progressive-web-apps/
- http://www.techrepublic.com/article/why-its-time-for-businesses-to-get-serious-about-progressive-web-apps
- http://www.cmo.com/features/articles/2017/4/27/get-ready-to-surf-the-next-wave-of-the-mobile-webpwas.html
- http://blog.ionic.io/what-is-a-progressive-web-app/
- https://developers.google.com/web/progressive-web-apps/
- https://developers.google.com/web/progressive-web-apps/checklist
- http://www.androidcentral.com/twitter-lite-progressive-web-app-thats-designed-emerging-markets
- https://github.com/GoogleChrome/samples/blob/gh-pages/web-application-manifest/manifest.json
- https://jakearchibald.com/2014/offline-cookbook/
- https://medium.com/javascript-scene/native-apps-are-doomed-ac397148a2c0
- https://www.talater.com/upup/
- https://addyosmani.com/blog/getting-started-with-progressive-web-apps/
- http://bit.ly/pwa-angularsummit-2017
- http://slides.com/webmax/pwa-ngpoland#/33
- https://docs.google.com/document/d/19S5ozevWighny788nI99worpcIMDnwWVmaJDGf_RoDY/edit#heading=h.z3fi3lc8mayc

### PWA Videos
- https://www.youtube.com/watch?v=cmGr0RszHc8
- https://www.udacity.com/course/offline-web-applications--ud899
- https://www.youtube.com/watch?v=C8KcW1Nj3Mw


### Samples

- https://paperplanes.world/
- https://github.com/webmaxru/pwa-workshop-angular/tree/step9
- https://pwa-workshop-angular.firebaseapp.com/

