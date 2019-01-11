import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { SignaturePage } from '../signature/signature';

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
export class DeliveriesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public modalController : ModalController) {
      this.signatureImage = navParams.get('signatureImage');
      console.log("sig from deleveries : "+this.signatureImage);
  }
  public signatureImage : string;
  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveriesPage');
  }

  openSignatureModel(){
    let model = this.modalController.create(SignaturePage);
    model.present();
  }
}
