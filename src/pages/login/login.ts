import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../providers/authentication.service';

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
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authenticationService: AuthenticationService) {
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

    this.authenticationService.login(this.username, this.password)
            .pipe(first())
            .subscribe(
              
                data => {
                   // this.router.navigate([this.returnUrl]);
                   console.log("success");
                },
                error => {
                  console.log("error");
                  //this.alertService.error(error);
                   // this.loading = false;
                });
  }
}
