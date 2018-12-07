import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Delivery } from '../../models/delivery';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage implements OnInit{

  private delivery : Delivery;

  constructor(public navCtrl: NavController, public httpClient: HttpClient) {

  }

  ngOnInit(){
    this.httpClient.get<Delivery>('https://delivery20181025113758.azurewebsites.net/api/Deliveries/5')
    .subscribe(festchedDelivery => (this.delivery = festchedDelivery))
  }


}
