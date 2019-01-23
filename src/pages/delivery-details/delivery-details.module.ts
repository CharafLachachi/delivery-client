import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliveryDetailsPage } from './delivery-details';

@NgModule({
  declarations: [
    DeliveryDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(DeliveryDetailsPage),
  ],
})
export class DeliveryDetailsPageModule {}
