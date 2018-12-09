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
self.addEventListener('activate', function (event) {
  console.log("ACTIVATING");
  const activationCompleted = Promise.resolve()
    .then((activationCompleted) => console.log("ACTIVATED"));

  event.waitUntil(activationCompleted);
});

// self.onfetch = function(event) {
//   console.log("HTTP call intercepted - " + event.request.url);
//   return event.respondWith(fetch(event.request.url));
// }
/**
 * Executed when the connection is Back
 */
self.addEventListener('sync', function (event) {
  console.log(' [Service Worker] Background syncing', event);
  // Check if sync tag was add Before
  if (event.tag === 'sync-new-delivery') {
    console.log('[Service Worker] is syncing new Delivery');
    event.waitUntil(
      postSyncDeliveries()
    );
  }
  if (event.tag === 'sync-new-deliveryman') {
    console.log('[Service Worker] is syncing  DeliveryMan');
    event.waitUntil(
      postSyncDeliveryMan()
    );
  }
  // Here you can add Switch case for tags
});

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



// *********** Sync Functions ***************
function postSyncDeliveries() {
  // Open SyncDb where syncronized Data was added when connection was off
  new Dexie('SyncDB').open().then(function (db) {
    console.log("Found database: " + db.name);
    console.log("Database version: " + db.verno);
    // In this case we deal with deliveries, so we fetch all deliveries from SyncDb, 
    // exactly in SyncDelivery Table
    db.table('syncDelivery')
      .each((delivery) => {
        // For each Delivery we send POST request to the server
        const url = "https://localhost:44317/api/Deliveries/";
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(delivery)
        })
          .then((res) => {
            // Clear Table because data was sent to the server successfully
            db.table('syncDelivery').clear();
          }).catch((err) => {
            console.log(err);
          })
      });
  }).catch('NoSuchDatabaseError', function (e) {
    // Database with that name did not exist
    console.error("Database not found");
  }).catch(function (e) {
    // Unknown error
    console.error("Oh uh: " + e);
  });
}

function postSyncDeliveryMan() {
  // Open SyncDb where syncronized Data was added when connection was off
  new Dexie('SyncDB').open().then(function (db) {
    console.log("Found database: " + db.name);
    console.log("Database version: " + db.verno);
    // In this case we deal with deliveries, so we fetch all deliveries from SyncDb, 
    // exactly in SyncDelivery Table
    db.transaction('rw', db.table('syncDeliveryMan'), function () {
      // Normaly we have only one DeliveryMan 
      db.table('syncDeliveryMan').each((deliveryMan) => {
        // For each Delivery we send POST request to the server
        const url = "https://localhost:44317/api/DeliveryMen/" + deliveryMan['id'];
        fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(deliveryMan)
        }).then((res) => {
          // Clear Table because data was sent to the server successfully
          console.log("put success", res);
          // Bad Performance issue, because we'll use a new connection and transaction, but
          // i couldn't handle clear() in the same transcation, i had some transaction already closed errors
          clearSyncDeliveryManTable();

          // TODO edit DeliveryMan in myDb, because it still contains old data
        }).
          catch((err) => {
            console.log(err);
          })

      });
    })
  }).catch('NoSuchDatabaseError', function (e) {
    // Database with that name did not exist
    console.error("Database not found");
  }).catch(function (e) {
    // Unknown error
    console.error("Oh uh: " + e);
  });
}

function clearSyncDeliveryManTable() {
  new Dexie('SyncDB').open().then(function (db) {
    console.log("Found database: " + db.name);
    console.log("Database version: " + db.verno);
    db.transaction('rw', db.table('syncDeliveryMan'), function () {
      db.table('syncDeliveryMan').clear().catch((err) => {
        console.log("can't clear", err);
      })
    }).catch('NoSuchDatabaseError', function (e) {
      // Database with that name did not exist
      console.error("Database not found");
    }).catch(function (e) {
      // Unknown error
      console.error("Oh uh: " + e);
    });
  });
}