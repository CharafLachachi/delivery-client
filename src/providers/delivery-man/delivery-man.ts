import { ENV } from './../../environments/environment.dev';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import Dexie from "dexie";
import { IndexeddbserviceProvider } from '../indexeddbservice/indexeddbservice';
import { ToastController } from 'ionic-angular';
import { DeliveryMan } from '../../models/delivery.man';
import { Observable } from 'rxjs';

/*
  Generated class for the DeliveryManProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DeliveryManProvider implements OnInit {

 // private db: Promise<Dexie>;
 private apiURL : string;
  constructor(
    public httpClient: HttpClient,
    public indexedDbService: IndexeddbserviceProvider,
    private toastCtrl: ToastController,
    ) {
    console.log('Hello DeliveryManProvider Provider');
    // Get API url from environement variable
    this.apiURL = ENV.api;
  }
  public ngOnInit() {
    // Inialize the DataBase
   // this.db = this.initializeDataBase();
  }

  /**
   * 
   * @param deliveryMan JSON of deliveryMan to Edit
   */
  public putDeliveryMan(deliveryMan: any) {
    const connectionState: boolean = !!window.navigator.onLine
    const id = deliveryMan['id'];
    const url = this.apiURL+"/DeliveryMen/" + id;
    // The connection is up, so we have to send HTTP request directely to the server
    if (connectionState) {
      return this.httpClient
        .put(
          url,
          deliveryMan,
          { observe: "response" }) // Without this observer, we can't subscribe to the response
        .subscribe(
          (res: HttpResponse<any>) => { 
            console.log(res) 
           // if success, edit data in indexed db with modified one, (Because the deliveryMan where edited 
           // successfully )
           this.indexedDbService.editData('deliveryman',deliveryMan);
          },
          // TODO handle the errors to dipslay somthing to user depending on res.status code
          (err: HttpErrorResponse) => { console.log('Error ' + err.message) }
        )
      // The connection is down, so we have to register sync event in service worker, 
      // to handle request once connetion is restablished
    } else {
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        console.log("service worker and syncManager found");

        navigator.serviceWorker.ready
          .then((sw) => {
            console.log("Tryning to add deliverMan to syncDb");
            this.indexedDbService.writeSyncData("deliveryman", deliveryMan)
              .then(() => {
                return sw.sync.register('sync-new-deliveryman');
              }).then(() => {
                // Just for display, Remove it in production
                let toast = this.toastCtrl.create({
                  message: 'tag : sync-new-deliveryman  registred',
                  duration: 3000,
                  position: 'top'
                });
                toast.present();
              }).catch((e) => {
                console.log("Sync err "+e);
              });
          }).catch((err) => {
            console.log(err);      
          })
           /**  
         * [Offline] , ServiceWorker or SyncManger aren't available, so we have to handle 
         * background sync manually by adding data to SyncDb
         * [Important] this background synchronisation work only if application process is available, 
         * in counter of Service worker that handle synchronistion even if the application is closed.
        */
        }else {

        }

    }
  }
  // Get delivery Man when Profile page is loaded
  getDeliveryMan(id : any) : Observable<DeliveryMan>{
    const url =  this.apiURL+"/DeliveryMen/" + id;
    if(!!window.navigator.onLine){
      return this.httpClient.get<DeliveryMan>(url);

    }
    else{
      console.log("hors ligne");
      
      return new Observable();

    }
    // TODO else fetch from IndexedDb
  }
  // When the page is loaded
  storeDeliveryManInDb(deliveryMan : DeliveryMan) {
    // TODO check if syncDB contains one, so we have to overwrite it
    this.indexedDbService.writeData("deliveryman", deliveryMan);
  }

  editStoredDeliveryManInDb(deliveryMan : DeliveryMan) {

  }

  // private initializeDataBase(): Promise<Dexie> {
  //   // First Try to open DataBase if it was already created
  //   new Dexie('__mydb').open().then(function (db) {
  //     console.log("Found database: " + db.name);
  //     console.log("Database version: " + db.verno);
  //     return Promise.resolve(db);

  //   }).catch('NoSuchDatabaseError', function (e) {
  //     // Database with that name did not exist, so we have to create it
  //     console.error("Database not found");
  //     const db = new Dexie('__mydb');
  //     this.db.version(1).stores({
  //       delivery: 'id,createdAt,modifiedAt,state,deliveryManId,orderId,deliveryMan,order',
  //       deliveryMan: 'firstname,lastname,phoneNumber,email,deliveryManAddress,passwordHash,passwordSalt,deliveryManAddressNavigation,delivery'
  //     });
  //     return Promise.resolve(db)

  //   }).catch(function (e) {
  //     // Unknown error
  //     console.error("Oh uh: " + e);
  //   });
  //   return null;
  // }

}
