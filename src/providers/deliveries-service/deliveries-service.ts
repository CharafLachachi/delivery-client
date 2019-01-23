import { Observable } from 'rxjs';
import { ENV } from './../../environments/environment.dev';
import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { IndexeddbserviceProvider } from "../indexeddbservice/indexeddbservice";
import { ToastController } from "ionic-angular";
import { Delivery } from "models/delivery";


/*
  Generated class for the DeliveriesServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class DeliveriesServiceProvider implements OnInit {

    private apiURL : string;
    private signatureURL : string;

  constructor(
    public httpClient: HttpClient,
    public indexedDbService: IndexeddbserviceProvider,
    private toastCtrl: ToastController,
    ) 
  {
    console.log('Hello DeliveriesServiceProvider Provider');
    // Get API url from environement variable
    this.apiURL = ENV.api;
    this.signatureURL = '';
  }
  
  public ngOnInit() 
  {
  
  }

  /**
   * @param delivery JSON of delivery to validate
   */

  public validateDelivery( delivery : Delivery ) {

    const connectionState: boolean = !!window.navigator.onLine
    const id = delivery.id;
    const url = this.apiURL+"/Deliveries/"+id;

    // The connection is up, so we have to sset validation dateend an HTTP request directely to the server

    if (connectionState) 
    {
           delivery.state = 1; 
         //TODO set validation date 
           let modifiedAtCapture = delivery.modifiedAt 
           delivery.modifiedAt = new Date().toISOString(); 
         
      return this.httpClient
        .put( url, delivery, { observe: "response" })
        .subscribe(
          (res: HttpResponse<any>) => { 
            console.log(res) 
            this.indexedDbService.editData('delivery',delivery);
          },
          // TODO handle the errors to dipslay somthing to user depending on res.status code
          (err: HttpErrorResponse) => 
          { 
            // rollback
             delivery.state = 0;  
             delivery.modifiedAt = modifiedAtCapture;  
             console.log('Error ' + err.message) 
          }
        )
      
    } else {
      
      // The connection is down, so we have to register sync event in service worker, 
      // and handle the request once the connetion is restablished
      
      if ('serviceWorker' in navigator && 'SyncManager' in window) 
      {
        console.log("service worker and syncManager found");
        delivery.state = 1;
        //TODO set validation date 
        delivery.modifiedAt = new Date().toISOString(); 

        navigator.serviceWorker.ready
          .then((sw) => 
          {  
            console.log("Tryning to add a delivery to syncDb");
            this.indexedDbService
              .writeSyncData("delivery", delivery)
              .then(() => 
              {
                return sw.sync.register('sync-new-delivery');
              })
              .then(() => 
              {
                // Just for display, Remove it in production
                let toast = this.toastCtrl.create({
                  message: 'tag : sync-new-delivery registred',
                  duration: 3000,
                  position: 'top'
                });
                toast.present();
              }).catch((e) => {
                console.log("Sync err "+e);
              });
          }).catch((err) => {
            // rollback
            delivery.state = 0;  
            delivery.modifiedAt = ' '; 
            console.log(err);      
          
          })
         
      }
      else 
      {  
         /**  
          * [Offline] , ServiceWorker or SyncManger aren't available, so we have to handle 
          * background sync manually by adding data to SyncDb
          * [Important] this background synchronisation work only if application process is available, 
          * in counter of Service worker that handle synchronistion even if the application is closed.
          */

      }

    }
  }

  cancelDelivery( delivery : any ) 
  {
    const connectionState: boolean = !!window.navigator.onLine
    const id = delivery['id'];
    const url = this.apiURL+"/Deliveries/";

    // The connection is up, so we have to send an HTTP request directely to the server

    if (connectionState) 
    {
          delivery.state = 2; 
         //TODO set validation date 
           delivery.modifiedAt = new Date(); 
         
      return this.httpClient
        .put( url, JSON.stringify(delivery) , { observe: "response" })
        .subscribe(
          (res: HttpResponse<any>) => { 
            console.log(res) 
            this.indexedDbService.editData('delivery',delivery);
          },
          // TODO handle the errors to dipslay somthing to user depending on res.status code
          (err: HttpErrorResponse) => 
          { 
            // rollback
             delivery.state = 0;  
             delivery.modifiedAt = ' ';  
             console.log('Error ' + err.message) 
          }
        )
      
    } else {
      
      // The connection is down, so we have to register sync event in service worker, 
      // and handle the request once the connetion is restablished
      
      if ('serviceWorker' in navigator && 'SyncManager' in window) 
      {
        console.log("service worker and syncManager found");
        delivery.state = 2;
        //TODO set validation date 
        delivery.modifiedAt = new Date(); 

        navigator.serviceWorker.ready
          .then((sw) => 
          {  
            console.log("Tryning to add a delivery to syncDb");
            this.indexedDbService
              .writeSyncData("delivery", delivery)
              .then(() => 
              {
                return sw.sync.register('sync-new-delivery');
              })
              .then(() => 
              {
                // Just for display, Remove it in production
                let toast = this.toastCtrl.create({
                  message: 'tag : sync-new-delivery registred',
                  duration: 3000,
                  position: 'top'
                });
                toast.present();
              }).catch((e) => {
                console.log("Sync err "+e);
              });
          }).catch((err) => {
            // rollback
            delivery.state = 0;  
            delivery.modifiedAt = ' '; 
            console.log(err);      
          
          })
         
      }
      else 
      {  
         /**  
          * [Offline] , ServiceWorker or SyncManger aren't available, so we have to handle 
          * background sync manually by adding data to SyncDb
          * [Important] this background synchronisation work only if application process is available, 
          * in counter of Service worker that handle synchronistion even if the application is closed.
          */

      }

    }

  }
 
  isSynchronized(table,data) : boolean  
  {
      return this.indexedDbService.isSynchronized(table,data)
  }

  removeFromCache( delivery : any )
  {
    this.indexedDbService.removeFromCache( delivery );
  }

  getAllDeliveries() : Observable<Delivery[]>
  {
    const connectionState: boolean = !!window.navigator.onLine
    const url = this.apiURL+"/Deliveries";

    var deliveries : Delivery[]; 

    // The connection is up, fetch new deliveries from server and add them to indexedDB first (if they are not already there) 
    // then fetch all deliveries from indexedDB and display them.

    if (connectionState) 
    {
      return this.httpClient
        .get<Delivery[]>( url )
        // .subscribe(
        //   res => 
        //   { 
        //       console.log("Fetched Data",res);
              
        //       this.indexedDbService.updateDeliveries(res);
        //       deliveries = this.indexedDbService.fetchAllDeliveries() ; 
        //   },
        //   (err: HttpErrorResponse) => 
        //   { 
        //      console.log('Error ' + err.message) 
        //   }
        // )
      
    } else {
      
      // The connection is down, fetch deliveries from indexedDB
      deliveries = this.indexedDbService.fetchAllDeliveries()
    
    }
    
   // return deliveries; 
    }

    getSignatureURL() : string 
    {
        return this.signatureURL;
    }

    setSignatureURL(url : string) 
    {
        this.signatureURL = url;
    }
}
