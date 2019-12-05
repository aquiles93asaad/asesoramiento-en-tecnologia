import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../environments/environment';
import { User } from '../models';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userUrl = environment.baseUrl + 'user/';

    constructor(
        private http: HttpClient
    ) { }

    check(email: string): Observable<any> {
        return this.http.post(this.userUrl + 'check', {
            email
        }).pipe(
            map(
                (data: any) => {
                    if (typeof data.userExists !== 'undefined') {
                        return data.userExists;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    update(user: User): Observable<any> {
        return this.http.put(this.userUrl + 'update', {
            user
        }).pipe(
            map(
                (data: any) => {
                    if (data.user) {
                        return data.user;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    addComputerToFavourites(computersIds: string[]): Observable<any> {
        return this.http.post(this.userUrl + 'setFavourites', {
            computersIds
        }).pipe(
            map(
                (data: any) => {
                    if (data.user) {
                        return data.user;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    getUserSearchHistory(): Observable<any> {
        return this.http.get(environment.baseUrl + 'search-history/user-search-history').pipe(
            map(
                (data: any) => {
                    if (data.searchHistory) {
                        return data.searchHistory;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
}
