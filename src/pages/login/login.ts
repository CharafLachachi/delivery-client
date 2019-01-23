import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TabsPage } from './../tabs/tabs';
import { HomePage } from './../home/home';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../providers/authentication.service';
import emailMask from 'text-mask-addons/dist/emailMask';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {


  form: FormGroup;
  emailMask = emailMask;

 
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder,) {

                this.form = this.formBuilder.group(
                  {
                    password : new FormControl('',  Validators.compose([
                      Validators.minLength(5),
                      Validators.required,
                    ])),
            
                    email: new FormControl('', Validators.compose([
                      Validators.required,
                      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
                    ])),

                  }
                )
  }

  ngOnInit() {
    this.form.setValue({
      email: "lac.charaf@gmail.fr",
      password: "smail"
    })
    var displayDate = new Date();
    console.log("date : "+displayDate);
  }

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
    ]  
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  login(){
    console.log("username : "+this.form.value.email);
    console.log("password : "+this.form.value.password);

    this.authenticationService.login(this.form.value.email, this.form.value.password)
            .pipe(first())
            .subscribe(
              
                data => {
                   console.log(data);
                   console.log("success");
                   this.navCtrl.push(TabsPage);
                },
                error => {
                  console.log("error");
                  //this.alertService.error(error);
                   // this.loading = false;
                });
  }
}
