import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../environments/environment';

import { TokenStorage } from './token.storage';
import { User } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private authUrl = environment.baseUrl + 'auth/';

    constructor(
        private http: HttpClient,
        private token: TokenStorage
    ) { }

    private userSourceSubject = new BehaviorSubject<User>(null);
    public userSource = this.userSourceSubject.asObservable();

    private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
    public isAuthenticated = this.isAuthenticatedSubject.asObservable();

    login(email: string, password: string, rememberMe?: boolean): Observable<any> {
        return this.http.post(this.authUrl + 'login', {
            email,
            password
        }).pipe(
            map((data: any) => {
                if (data.user) {
                    this.setUser(data.user);
                    if (rememberMe) {
                        this.token.saveToken(data.token);
                    }
                    return data.user;
                }

                throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
            })
        );
    }

    register(user: User): Observable<any> {
        return new Observable(observer => {
            this.http.post(this.authUrl + 'register', {
                user
            }).subscribe((data: any) => {
                observer.next({ user: data.user });
                this.setUser(data.user);
                this.token.saveToken(data.token);
                observer.complete();
            });
        });
    }

    setUser(user: User): void {
        (user) ? this.isAuthenticatedSubject.next(true) : this.isAuthenticatedSubject.next(false);
        this.userSourceSubject.next(user);
        (window as any).user = user;
    }

    me(): Observable<any> {
        return new Observable(observer => {
            const tokenVal = this.token.getToken();
            if (!tokenVal) {
                this.isAuthenticatedSubject.next(false);
                return observer.complete();
            }
            this.http.get(this.authUrl + 'me').subscribe((data: any) => {
                observer.next({ user: data.user });
                this.setUser(data.user);
                observer.complete();
            });
        });
    }

    signOut(): void {
        this.token.signOut();
        this.setUser(null);
        delete (window as any).user;
    }
}
