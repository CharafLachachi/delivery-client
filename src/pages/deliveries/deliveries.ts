import { IndexeddbserviceProvider } from './../../providers/indexeddbservice/indexeddbservice';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Delivery } from 'models/delivery';
import { DeliveriesServiceProvider } from '../../providers/deliveries-service/deliveries-service';
import { DeliveryDetailsPage } from '../delivery-details/delivery-details';

/**
 * Generated class for the DeliveriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-deliveries',
  templateUrl: 'deliveries.html',
})
export class DeliveriesPage implements OnInit{
  
  deliveries : Delivery[];
  connectionState: boolean = !!window.navigator.onLine

  ngOnInit() {
  
   if(this.connectionState){
    this.deliveriesService.getAllDeliveries()
    .subscribe(
      result => { 
        this.deliveries = result
        this.indexedDbService.updateDeliveries(result);
      });
   } else{
    this.deliveries = this.indexedDbService.fetchAllDeliveries()
   }
    
    
  }


  constructor(public navCtrl: NavController, public navParams: NavParams,
              public deliveriesService : DeliveriesServiceProvider,
              public indexedDbService : IndexeddbserviceProvider) {

  }

  showDetails(delivery : Delivery) 
  {
    this.navCtrl.push( DeliveryDetailsPage, { del: delivery } );
  }

  onRefresh()
  {
    this.deliveriesService.getAllDeliveries().subscribe(result => this.deliveries = result);
  }

  getState(state : number) : string {
    switch (state) {
      case 0 : {
        return "En Attente"
      }
      case 1 : {
        return "Validée"
      }
      case 2 : {
        return "Annulée"
      }
    }
  }
  getColor(state : number) : string {
    switch (state) {
      case 0 : {
        return "light"
      }
      case 1 : {
        return "secondary"
      }
      case 2 : {
        return "danger"
      }
    }
  }
}

