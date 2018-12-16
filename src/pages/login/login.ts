import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username:string;
  password:string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  login(){
    console.log("username : "+this.username);
    console.log("pasword : "+this.password);
  /**   fetch('http://httpbin.org/ip',{
      method:'GET',
      headers:{
        'Content-Type' : 'application/json',
        'Accept':'application/json'
      },
      body: JSON.stringify({message:'does this work ?'})
    
    })
    .then( function(response){
      console.log(response);
    });*/
  }
}
