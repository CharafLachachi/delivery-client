import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from './../../providers/authentication.service';
import { DeliveryManProvider } from './../../providers/delivery-man/delivery-man';
import { OnlineOfflineServiceProvider } from './../../providers/online-offline-service/online-offline-service';
import { IndexeddbserviceProvider } from './../../providers/indexeddbservice/indexeddbservice';
import { TextMaskModule } from 'angular2-text-mask';
import { async, TestBed } from '@angular/core/testing';
import { IonicModule, Platform, NavController } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ProfilePage } from './profile';
import {
  PlatformMock,
  StatusBarMock,
  SplashScreenMock
} from '../../../test-config/mocks-ionic';

describe('Profile Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilePage],
      imports: [
        IonicModule.forRoot(ProfilePage),
        TextMaskModule
      ],
      providers: [
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock },
        DeliveryManProvider,
        NavController,
        FormBuilder,
        HttpClient
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});