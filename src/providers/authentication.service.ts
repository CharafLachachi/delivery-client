import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ENV } from './../environments/environment';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        console.log("hello from auth service");

        
       // console.log("hey :"+this.http.get((`{ENV.api}/users/all`)))
        return this.http.post<any>(ENV.api+'/deliverymen/authenticate', { Username: username, Password: password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                console.log("yeeees");
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                console.log(user.username);
                console.log("hello");
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}