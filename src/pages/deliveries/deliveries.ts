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

  ngOnInit(): void {
  
    this.deliveries = this.deliveriesService.getAllDeliveries();
  }


  constructor(public navCtrl: NavController, public navParams: NavParams,
              public deliveriesService : DeliveriesServiceProvider) {

  }

  showDetails(delivery : Delivery) 
  {
    this.navCtrl.push( DeliveryDetailsPage, { del: delivery } );
  }

  onRefresh()
  {
    this.deliveries = this.deliveriesService.getAllDeliveries();
  }
}

