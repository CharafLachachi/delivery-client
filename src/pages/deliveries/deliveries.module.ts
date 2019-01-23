import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliveriesPage } from './deliveries';

@NgModule({
  declarations: [
    DeliveriesPage,
  ],
  imports: [
    IonicPageModule.forChild(DeliveriesPage),
  ],
})
export class DeliveriesPageModule {}
