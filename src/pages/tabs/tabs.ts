import { DeliveriesPage } from './../deliveries/deliveries';
import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';
import { NavController, NavParams } from 'ionic-angular';
import { SignaturePage } from '../signature/signature';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = DeliveriesPage;
  tab2Root = AboutPage;
  tab3Root = ProfilePage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    }

 
}
