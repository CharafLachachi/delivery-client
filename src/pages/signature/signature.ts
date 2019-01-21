import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SignaturePad} from 'angular2-signaturepad/signature-pad';
import { DeliveriesServiceProvider } from '../../providers/deliveries-service/deliveries-service';

/**
 * Generated class for the SignaturePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html',
})
export class SignaturePage {

  @ViewChild(SignaturePad) public signaturePad : SignaturePad;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public deliveriesService : DeliveriesServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignaturePage');
  }
  public signatureImage : string;
  private signaturePadOptions : Object = {
    'minWidth': 1,
    'canvasWidth':340,
    'canvasHeight':200
  };

  drawComplete(){
    this.signatureImage = this.signaturePad.toDataURL();
    console.log("signature : "+this.signatureImage);
    //this.navCtrl.push(DeliveryDetailsPage, {signatureImage : this.signatureImage });
    this.deliveriesService.setSignatureURL(this.signatureImage);
    this.navCtrl.pop();
  }

  drawClear(){
    this.signaturePad.clear();
  }

  drawCancel(){
    // this.navCtrl.push(DeliveryDetailsPage, {signatureImage : '' });
    this.deliveriesService.setSignatureURL('');
    this.navCtrl.pop();
  }

  canvasRecize(){
    console.log("hey");
    let canvas = document.querySelector('canvas');
    this.signaturePad.set('canvasWidth',canvas.offsetWidth);
    this.signaturePad.set('canvasHeight',canvas.offsetHeight);
  }

  ngAfterViewInit(){
    console.log("ng");
    this.signaturePad.clear();
    this.canvasRecize();
  }
}
