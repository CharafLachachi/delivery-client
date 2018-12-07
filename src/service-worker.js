/**
 * Check out https://googlechromelabs.github.io/sw-toolbox/ for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */


'use strict';
importScripts('./build/sw-toolbox.js');
importScripts('./assets/js/idb.js');
importScripts('./assets/js/dexie.min.js');
importScripts('./assets/js/axios.min.js');

self.toolbox.options.cache = {
  name: 'ionic-cache'
};
self.addEventListener('activate', function(event) {
  console.log("ACTIVATING");
  const activationCompleted = Promise.resolve()
      .then((activationCompleted) => console.log("ACTIVATED"));

  event.waitUntil(activationCompleted);
});

// self.onfetch = function(event) {
//   console.log("HTTP call intercepted - " + event.request.url);
//   return event.respondWith(fetch(event.request.url));
// }

self.addEventListener('sync', function(event){
  console.log(' [Service Worker] Background syncing', event);
  if(event.tag === 'sync-new-delivery'){
    console.log('[Service Worker] is syncing new Delivery');
    event.waitUntil(

      new Dexie('SyncDB').open().then(function (db) {
        console.log ("Found database: " + db.name);
        console.log ("Database version: " + db.verno);
        db.table('syncDelivery')
        .each((delivery) => {
          const url = "https://localhost:44317/api/Deliveries/";
          fetch(url, {
            method : 'POST',
            headers : {
              'Content-Type' : 'application/json',
              'Accept' : 'application/json'
            },
            body : JSON.stringify(delivery)
          }).catch((err) => {
            console.log(err);
          })
        });
    }).catch('NoSuchDatabaseError', function(e) {
        // Database with that name did not exist
        console.error ("Database not found");
    }).catch(function (e) {
        console.error ("Oh uh: " + e);
    })
    );
   }
});


// });
// self.addEventListener('fetch' , function(event){
//  // var url = 'https://delivery20181025113758.azurewebsites.net/api/Deliveries/5';
//   // if(event.request.url.indexOf(url) > -1){
//   //   console.log('[Service Worker] Fetching somthing from API', event);
//   // }else{
//   // console.log('[Service Worker] Fetching somthing', event);
//   // }
 
//   console.log("HTTP call intercepted - " + event.request.url);
//   return event.respondWith(fetch(event.request.url));
//  // event.respondWith(null);
// });

// pre-cache our key assets
self.toolbox.precache(
  [
    './build/main.js',
    './build/vendor.js',
    './build/main.css',
    './build/polyfills.js',
    './assets/js/idb.js',
    './assets/js/dexie.min.js',
    'index.html',
    'manifest.json'
  ]
);

// dynamically cache any other local assets
self.toolbox.router.any('/*', self.toolbox.fastest);

// for any other requests go to the network, cache,
// and then only use that cached resource if your user goes offline
self.toolbox.router.default = self.toolbox.networkFirst;
