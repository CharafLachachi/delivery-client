import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Delivery } from '../../models/delivery';
import Dexie from "dexie";
import { DeliveryMan } from '../../models/delivery.man';

/*
  Generated class for the IndexeddbserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IndexeddbserviceProvider  {
  private syncDb: any;
  private db: any;
  // private dbPromise = this.initDb();
  constructor(public http: HttpClient) {
    console.log('Hello IndexeddbserviceProvider Provider');

    this.createSyncDatabase();
    this.createDatabase();

  }

  //********* DataBase Creation ***********/
  private createSyncDatabase() {
    this.syncDb = new Dexie('SyncDB');
    this.syncDb.version(1).stores({
      syncDelivery: 'id,createdAt,modifiedAt,state,deliveryManId,orderId,deliveryMan,order',
      syncDeliveryMan: 'id,firstname,lastname,phoneNumber,email,deliveryManAddress,passwordHash,passwordSalt,deliveryManAddressNavigation,delivery'

    });
    console.log("Sync db created");


  }
  private createDatabase() {
    this.db = new Dexie('__mydb');
    this.db.version(1).stores({
      delivery: 'id,createdAt,modifiedAt,state,deliveryManId,orderId,deliveryMan,order',
      deliveryMan: 'id,firstname,lastname,phoneNumber,email,deliveryManAddress,passwordHash,passwordSalt,deliveryManAddressNavigation,delivery'

    });
  }

  //********* DataBase Insertion ***********/
  public writeData(st, data) {
    switch (st) {
      case 'delivery': {
        this.db.delivery
          .add(data)
          .then(async () => {
            const allItems: Delivery[] = await this.db.delivery.toArray();
            // console.log('saved in DB, DB is now ', allItems);

          })
          .catch(e => {
            // alert('Error' + (e.stack || e));
          });
          break;
      }

      case 'deliveryman': {
        this.db.deliveryMan
          .add(data)
          .then(async () => {
            const allItems: DeliveryMan[] = await this.db.deliveryMan.toArray();
             console.log('saved in  DB, deliveryMan table is now ', allItems);
          })
          .catch(e => {
            console.log('Error' + (e.stack || e));
          });
          break;
      }
    }

  }

  public writeSyncData(st, data): Promise<void> {
    return new Promise(resolve => {
      console.log("write sync data called");

      switch (st) {
        case 'delivery': {
          this.syncDb.syncDelivery
            .add(data)
            .then(async () => {
              const allItems: Delivery[] = await this.syncDb.syncDelivery.toArray();
              console.log('saved in DB sync, syncDelivery table  is now ', allItems);
            })
            .catch(e => {
              console.log('Error' + (e.stack || e));
            });
            break;
        }
        case 'deliveryman': {
          this.syncDb.table('syncDeliveryMan')
            .add(data)
            .then(async () => {
              const allItems: DeliveryMan[] = await this.syncDb.syncDeliveryMan.toArray();
              console.log('saved in DB sync, syncDeliveryMan table  is now ', allItems);
            })
            .catch(e => {
              console.log('Error deliveryman' + (e.stack || e));
            });
            break;
        }
      }
      resolve();
    });

  }

  //********* DataBase Edition ***********/
public editData(table, data) {
  switch (table){
    case 'deliveryman' : {
      this.db.deliveryMan
      .update(data['id'], data)
      .then(async (updated) => {
       if(updated){
        const allItems: DeliveryMan[] = await this.db.deliveryMan.toArray();
        console.log('Edited DeliveryMan in DB, DB is now ', allItems);
       }else {
        console.log ("Nothing was updated - there were no DeliveryMan with primary key:" + data['id']);
       }
      })
      .catch(e => {
        console.log('Error' + (e.stack || e));
      });
    }
  }
}


  async readAllData() {
    const data = await this.db.delivery.where("state").equals(32).toArray();
    console.log(data);
    return data;
  }
 


}

