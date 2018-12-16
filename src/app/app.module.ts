import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AboutPage } from '../pages/about/about';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { IonicStorageModule } from '@ionic/storage';
import { IndexeddbserviceProvider } from '../providers/indexeddbservice/indexeddbservice';
import { OnlineOfflineServiceProvider } from '../providers/online-offline-service/online-offline-service';
import { TextMaskModule } from "angular2-text-mask";
import { DeliveryManProvider } from '../providers/delivery-man/delivery-man';

import { LoginPage } from '../pages/login/login';
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ProfilePage,
    HomePage,
    TabsPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    TextMaskModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ProfilePage,
    HomePage,
    TabsPage,
    LoginPage
  ],
  providers: [
    {provide: ErrorHandler, 
      useClass: IonicErrorHandler},
    IndexeddbserviceProvider,
    OnlineOfflineServiceProvider,
    DeliveryManProvider
  ]
})
export class AppModule {}
