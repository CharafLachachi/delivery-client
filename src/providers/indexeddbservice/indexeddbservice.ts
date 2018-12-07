import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Delivery } from '../../models/delivery';
import  Dexie  from "dexie";

/*
  Generated class for the IndexeddbserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IndexeddbserviceProvider implements OnInit {
  private syncDb: any;
  private db: any;
  // private dbPromise = this.initDb();
  constructor(public http: HttpClient) {
    console.log('Hello IndexeddbserviceProvider Provider');
    
    this.createSyncDatabase();
    this.createDatabase();

  }
  private createSyncDatabase(){
    this.syncDb = new Dexie('SyncDB');
    this.syncDb.version(1).stores({
      syncDelivery: 'id,createdAt,modifiedAt,state,deliveryManId,orderId,deliveryMan,order'
    });
    console.log("Sync db created");
    

  }
  private createDatabase() {
    this.db = new Dexie('__mydb');
    this.db.version(1).stores({
      delivery: 'id,createdAt,modifiedAt,state,deliveryManId,orderId,deliveryMan,order'
    });
  }

  // private initDb(): Promise<IDBDatabase> {
  //   if (this.db) {
  //     this.db.close();
  //   }
  //   return new Promise(resolve => {
  //     const openRequest = indexedDB.open("__mydb", 1);

  //     openRequest.onupgradeneeded = event => {
  //       const target: any = event.target;
  //       const db = target.result;
  //       if (!db.objectStoreNames.contains('delivery')) {
  //         const store = db.createObjectStore('delivery', { keyPath: 'id' });
  //       }
  //     };

  //     openRequest.onsuccess = event => {
  //       console.log("onsuccess")
  //       this.db = (<any>event.target).result;
  //       this.db.onerror = event => {
  //         console.log(event);
  //       };

  //       resolve(this.db);
  //     }
  //   });
  // }

  ngOnInit() {

  }

  public writeData(st, data) {
    // return this.dbPromise.then((db) => {
    //   const tx = this.db.transaction(st, 'readwrite');
    //   const store = tx.objectStore(st);
    //   store.put(data);
    // }).catch((err) => {
    //   console.log("IndexedDb write data error " + err);
    // });
    this.db.delivery
    .add(data)
    .then( async () => {
      const allItems : Delivery[] = await this.db.delivery.toArray();
     // console.log('saved in DB, DB is now ', allItems);
      
    })
    .catch(e => {
     // alert('Error' + (e.stack || e));
    });
  }

  public writeSyncData(st, data) : Promise<void>{
    // return this.dbPromise.then((db) => {
    //   const tx = this.db.transaction(st, 'readwrite');
    //   const store = tx.objectStore(st);
    //   store.put(data);
    // }).catch((err) => {
    //   console.log("IndexedDb write data error " + err);
    // });
    return new Promise(resolve => {
      console.log("write sync data called");
      this.syncDb.syncDelivery
      .add(data)
      .then( async () => {
        const allItems : Delivery[] = await this.syncDb.syncDelivery.toArray();
        console.log('saved in DB sync, DB is now ', allItems);
        
      })
      .catch(e => {
       // alert('Error' + (e.stack || e));
      });
      resolve();
    });
    
  //   return new Dexie.Promise(function (resolve, reject) {
  //     // Do something and call resolve / reject when done.
  // }).then( (result) => {
  //   this.db.delivery
  //   .add(data)
  //   .then( async () => {
     
  //     const allItems : Delivery[] = await this.db.delivery.toArray();
  //     console.log('saved in syncDB, DB is now ', allItems);
  //   }).catch((er) => {
  //     alert('Error' + (er.stack || er));
  //   });
  // }).catch(function (e) {
  //     alert('Error' + (e.stack || e));
  // }).finally(function () {
  //     // This code will be called no matter if an error occurred or not.
  // });
   
    
  }

  async readAllData(){
    const data =  await this.db.delivery.where("state").equals(32).toArray();
    console.log(data);
    return data;
  }
  // public readAllData(st){
  //   return this.dbPromise.then((db) => {
  //     const tx = this.db.transaction(st, 'readonly');
  //     const store = tx.objectStore(st);
  //     return new Promise<Delivery[]>(resolve => {
  //       store.getAll(IDBKeyRange.bound(0,16))
  //       .onsuccess = e => resolve(e.target.result);
  //     })

  //   }).catch((err) => {
  //     console.log("IndexedDb write data error " + err);
  //   });
  // }

  
}

