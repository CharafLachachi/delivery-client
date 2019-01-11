import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../providers/authentication.service';


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

    this.authenticationService.login(this.username, this.password)
            .pipe(first())
            .subscribe(
              
                data => {
                   console.log(data);
                   console.log("success");
                },
                error => {
                  console.log("error");
                  //this.alertService.error(error);
                   // this.loading = false;
                });
  }
}
