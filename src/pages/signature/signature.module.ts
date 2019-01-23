import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignaturePage } from './signature';

@NgModule({
  declarations: [
    SignaturePage,
  ],
  imports: [
    IonicPageModule.forChild(SignaturePage),
  ],
})
export class SignaturePageModule {}
