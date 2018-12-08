import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PhoneValidator } from '../../validators/phone-validator';
import { Country } from '../../models/Country';
import { PasswordValidator } from '../../validators/pass.validators';
import emailMask from 'text-mask-addons/dist/emailMask';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { DeliveryManProvider } from '../../providers/delivery-man/delivery-man';

@Component({
  selector: 'page-contact',
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnInit{
  private form : FormGroup;
  private country_phone_group: FormGroup;
  private countries: Array<Country>;
  private matching_passwords_group: FormGroup;
  private emailMask = emailMask;
  private deliveryMan = {};

  constructor(public navCtrl: NavController,
    private formBuilder : FormBuilder,
    private httpClient : HttpClient,
    private deliveryManService : DeliveryManProvider) {

      // Countries Displayed in select Input, YOu can add your owns
      this.countries = [
        new Country('UY', 'Uruguay'),
        new Country('US', 'United States'),
        new Country('AR', 'Argentina'),
        new Country('DZ', 'Algeria'),
        new Country('FR', 'France')
      ];
      // Country select by default first Country
      let country = new FormControl(this.countries[0], Validators.required);
      let phone = new FormControl('', Validators.compose([
        Validators.required,
        PhoneValidator.validCountryPhone(country)
      ]));
      // Country phone Form Group
      this.country_phone_group = new FormGroup({
        country: country,
        phone: phone
      });
      // Password Form Group
      this.matching_passwords_group = new FormGroup({
        password: new FormControl('', Validators.compose([
          Validators.minLength(5),
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
        ])),
        confirm_password: new FormControl('', Validators.required)
      }, (formGroup: FormGroup) => {
        return PasswordValidator.areEqual(formGroup);
      });

      // Form Builder 
      this.form = this.formBuilder.group(
        {
          firstname: ['',  Validators.required],

          lastname: ['', Validators.required],

           matching_passwords: this.matching_passwords_group,

           email: new FormControl('', Validators.compose([
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
          ])),

          adresse: ['', Validators.required],

          country_phone: this.country_phone_group,
        }
      )
  }
 // All validation Messages displayed when error happend in inputs
  validation_messages = {
    'firstname': [
      { type: 'required', message: 'First Name is required.' }
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'phone': [
      { type: 'required', message: 'Phone is required.' },
      { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number. and no special char' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'Password mismatch' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ],
  };

  ngOnInit(){
    // Intialize controls with the data of current logged Delivery Man
    // Only for Test, After data will be fetched from server, or localstorage
    this.deliveryManService.getDeliveryMan(5).subscribe(dm => {
      this.deliveryMan = dm;
      // Tell Service to Store the DeliveryMan in IndexedDb, 
      // to use it in connection down case.
      this.deliveryManService.storeDeliveryManInDb(dm);
     
      // TODO retrive password from server
      this.matching_passwords_group.setValue({
          password : 'Password123',
          confirm_password : 'Password123',
        })
        // TODO add country ISO in the API
        this.country_phone_group.setValue({
          country :  new Country('FR', 'France'),
          phone : dm.phoneNumber
        })

        this.form.setValue({
          firstname : dm.firstname,
          lastname : dm.lastname,
          email : dm.email,
          matching_passwords : this.matching_passwords_group.value,
          country_phone : this.country_phone_group.value,
          adresse : '85 bd Brune' 
        })
    })
  }
   editForm(){
    // Is Working with password Null, If you need to add password you have to send it as Byte and not String
    // because if you send String , asp core api will throw exception and request fail. 
    this.deliveryMan = {
      id: 5,
      firstname: this.form.value.firstname,
      lastname: this.form.value.lastname,
      phoneNumber: this.form.value.country_phone.phone,
      email: this.form.value.email,
      deliveryManAddress: 4437,
      passwordHash: null,
      passwordSalt: null,
      deliveryManAddressNavigation: null,
      delivery: []
      };
      console.log(this.deliveryMan);
     
      // Call the service to send the put request, 
      // this method handle Online/Offline sync
      this.deliveryManService.putDeliveryMan(this.deliveryMan);

  }

}
