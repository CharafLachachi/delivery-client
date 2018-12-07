import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
/*
  Generated class for the OnlineOfflineServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OnlineOfflineServiceProvider {

  private internalConnectionChanged = new Subject<boolean>();

  get connectionChanged() {
    return this.internalConnectionChanged.asObservable();
  }

  get isOnline() {
    return !!window.navigator.onLine;
  }

  constructor() {
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
  }

  private updateOnlineStatus() {
    this.internalConnectionChanged.next(window.navigator.onLine);
  }

}
