import { Component, OnInit, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { SignaturePage } from '../signature/signature';
import { Delivery } from '../../models/delivery';
import { DeliveriesServiceProvider } from '../../providers/deliveries-service/deliveries-service';

/**
 * Generated class for the DeliveriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-delivery-details',
  templateUrl: 'delivery-details.html',
})
export class DeliveryDetailsPage implements OnInit {

  @Input() delivery : Delivery ; 
  
  public signatureImage : string = '';
  
  isSyncronized : boolean ; 
  canBeCanceled : boolean ; 
  canBeValidated : boolean ;
  canBeMasked : boolean

  ngOnInit(): void 
  {
     this.refreshInfos();
  }

  refreshInfos()
  {
    this.isSyncronized  =  this.deliveriesService.isSynchronized('delivery',this.delivery)
   
    /* 
      i made these suppositions : 
       state == 0 => delivery can either be validated or canlceled 
       state == 1 => delivery is validated 
       state == 2 => delivery is canceled 
    */

    this.canBeCanceled  = (this.delivery.state === 0) ? true : false;
    this.canBeValidated = (this.delivery.state === 0) ? true : false; 

    /* once the delivery is either canceled/validated and synchronized with server, it can now me masked from the delivery list */
    // TODO: in the methode onMaskDelivery() remove the delivery from all caches.  
    
    this.canBeMasked = this.isSyncronized && !this.canBeCanceled && !this.canBeMasked; 

  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalController : ModalController,
              public deliveriesService : DeliveriesServiceProvider,private toastCtrl: ToastController) {
    
                this.delivery = navParams.get('del');
                deliveriesService.setSignatureURL(''); 
                console.log("sig from deleveries : "+this.signatureImage);
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad Delivery Details Page');
  }

  openSignatureModel()
  {
    let model = this.modalController.create(SignaturePage);
    model.present();
  }



  onCancelDelivery()
  {
    this.deliveriesService.cancelDelivery(this.delivery);
    this.refreshInfos(); 
  }

  onMaskDelivery()
  { 
    // remove from caches 
    this.deliveriesService.removeFromCache(this.delivery);
    // goback() to parent
    this.navCtrl.pop();

    // refresh parent's deliveries by fetching data from cache to display changes ( call on refresh ) 
  }


  onValidateDelivery()
  {
      this.signatureImage = this.deliveriesService.getSignatureURL(); 
      
      // check if signature is okey first 

      if(this.signatureImage === '')
      {
        let toast = this.toastCtrl.create({
          message: 'tag : delivery must be signed before validation',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        return;
      }

      // signature is OK

      this.deliveriesService.validateDelivery(this.delivery);
      this.refreshInfos(); 

  }
}
