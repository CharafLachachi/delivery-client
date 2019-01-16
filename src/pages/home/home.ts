import { ENV } from './../../environments/environment.dev';
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Delivery } from '../../models/delivery';
import { IndexeddbserviceProvider } from '../../providers/indexeddbservice/indexeddbservice';
import { ToastController } from 'ionic-angular';
import { OnlineOfflineServiceProvider } from '../../providers/online-offline-service/online-offline-service';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/throw';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  private deliveries: Delivery[];
  private todo = {};
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };
  private apiURL : string;
  constructor(public navCtrl: NavController,
    public httpClient: HttpClient,
    public indexedDbService: IndexeddbserviceProvider,
    private toastCtrl: ToastController,
    private readonly onlineOfflineService: OnlineOfflineServiceProvider) {
      console.log(ENV.api);
      this.apiURL = ENV.api;
  }

  // Sbscribe to internet state event
  private registerToEvents(onlineOfflineService: OnlineOfflineServiceProvider) {
    onlineOfflineService.connectionChanged.subscribe(online => {
      if (online) {
        console.log('went online');
      } else {
        console.log('went offline');
      }
    });
  }
  ngOnInit() {
    this.writeInDb();
    this.registerToEvents(this.onlineOfflineService);

  }
  /**
   * TODO refactor Duplicated Code 
   * @param event 
   */
  submitForm(event) {
    console.log(this.todo);
    // syncmanager available only in Chrome 04/12/2018 (Firefox and Edge in developpement)
    if (this.onlineOfflineService.isOnline == false) {
      /**
       *  [Offline] , ServiceWorker and SyncManager are available, So we add Data in SyncDb and
       *  Register sync tag in service worker.
       */
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        console.log("service worker and syncManager found");

        navigator.serviceWorker.ready
          .then((sw) => {
            // Just for testing after we have to retrieve data from inputs
            let delivery: Delivery = {
              id: 1000005,
              createdAt: "1996-03-21T21:48:00",
              modifiedAt: new Date().toISOString(),
              state: 0,
              deliveryManId: 5000,
              orderId: 5000,
              deliveryMan: null,
              order: null
            };
            console.log("Tryning to add data to syncDb");
            this.indexedDbService.writeSyncData("delivery", delivery)
              .then(() => {
                return sw.sync.register('sync-new-delivery');
              }).then(() => {
                let toast = this.toastCtrl.create({
                  message: 'tag : sync-new-delivery  registred',
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
      } else {

      }
      /**
       * [Online], send HTTP request througth connection
       * 
       */
    } else {
      let delivery: Delivery = {
        id: 1000001,
        createdAt: "1996-03-21T21:48:00",
        modifiedAt: new Date().toISOString(),
        state: 0,
        deliveryManId: 6540,
        orderId: 5000,
        deliveryMan: null,
        order: null
      };
      this.httpClient.post( this.apiURL+"/Deliveries/",
        delivery,
        { observe: "response" }) // Wthout this observer we can't subscribe to the response
        .subscribe(
          (res: HttpResponse<any>) => { console.log(res) },
          // TODO handle the errors to dipslay somthing to user
          (err: HttpErrorResponse) => { console.log('Error ' + err.message) }
        )
    }
  }

  sendData() {
    let delivery: Delivery = {
      id: 5,
      createdAt: "1996-03-21T21:48:00",
      modifiedAt: new Date().toISOString(),
      state: 0,
      deliveryManId: 6540,
      orderId: 5000,
      deliveryMan: null,
      order: null
    };
    return this.httpClient.put( this.apiURL+"/Deliveries/5",
      delivery,
      { observe: "response" }) // Wthout this observer we can't subscribe to the response
      .subscribe(
        (res: HttpResponse<any>) => { console.log(res) },
        // TODO handle the errors to dipslay somthing to user
        (err: HttpErrorResponse) => { console.log('Error ' + err.message) }
      )
  }

  writeInDb() {
    for (let index = 1; index < 10; index++) {
      this.httpClient.get<Delivery>( this.apiURL+"/Deliveries/" + index)
        .toPromise()
        .then((d) => {
          this.indexedDbService.writeData("delivery", d);
        }).catch(err => {
          console.log("can't fetch deliveries from server",err);
        });
    }
  }

  fetchData() {
    this.indexedDbService.readAllData().then((data) => {
      console.log("fetched ", data);
      this.writedelivery(data);
    });

  }
  writedelivery(d) {
    this.deliveries = d;
  }
  



}

