# PwaAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.6.

## Try It

Run `ng b && cd dist && node index.js` for a dev server.

Enable the twilio texting feature by creating a Twilio account and running
`TWILIO_ACCOUNT_SID="sid-goes-here" TWILIO_AUTH_TOKEN="auth-token" TWILIO_PHONE="from-phone" node --inspect=5858 index.js`

Q> When are the files cached?
A> After the first successful load. The app will cache the files in the browser until the service worker changes.

Q> What happens when I am offline and a route is not found?
A> An offline page will be displayed when a route is not found.

Q> How do I send messages while offline and not block the user?
A> Background sync will fire. When online is detected, the sync message fires and messages go on their merry way.

## Variations
There are various techniques in this repo, contained in different branches. Each accomplishes similar tasks, with variations n the end result. Learn moer below. All contain `manifest.json`, and variations on the service worker and code to use the servie worker.

### Manual Service Worker
- *sw/manual* branch

The manual service worker contains a `sw.js` file which contains all of the logic that to accomplish:
1. precache of app shell files
2. fallback to `/offline.html` for unknown routes
3. runtime caching of routes (e.g. `/api/data` routes)
4. background sync
5. push notification subscription

#### Precaching
The first time the app loads, a list of files retrieved over the network are matched agains a list of precache routes. The matches' responses are stored in Application Cache. Subequent page refreshes will check the cache first for a match, if found it will return the reponse.

#### Fallback
When a route cannot be found in cache nor via fetch, the app redirects to an offline.html page.

#### Runtime caching
When a route cannot be found in cache, it is fetched. If the fetch returns a valid response, it is added to the Application Cache. Data calls to the api will be cached with runtime caching

#### Background Sync
When the user attempts to send a text message, the app detects if the service worker is available. If the service worker is available, the message is stored in IndexDB and a background sync message is sent to let the service worker know that message is ready. The service worker listens for the sync event and for the specific message tag. It then retrieves the message(s) from IndexDB and sends the text message(s) to the server. If the http post was successful, the messages are removed from IndexDB. If the http post fails, the messages remain in IndexDb.

If service worker is not available, the messages are sent online directly from the app, with no service worker involvement.

When the app is offline, the service worker's sync event does not fire. Once the app goes back online, the sync event fires and all messages found in IndexDB are posted to the server.

#### Push Notification
When the user clicks the "subscribe" button, the service worker will subscribe to a specific push notification from the server using a key. From this point when the server sends a push notification, the service worker will listen for it and show the push notification. Once the user unsubscribes, the push notifications will cease.

<!--### Workbox Caching and Extend with Manual Background Sync and Push
- *workbox/inject-caching-and-extend* branch

After responding, another fetch is fired off to check if the response has changed. If the response changed, it will cache the new response for next time.-->






