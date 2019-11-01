import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
    providedIn: 'root'
})
export class UsageProfileService {

    apiUrl = environment.baseUrl;
    constructor(
        private http: HttpClient
    ) { }

    search(): Observable<any> {
        const filters = {};
        return this.http.post(this.apiUrl + 'usage-profile/search', filters).pipe(
            map(
                (data: any) => {
                    if (data.usageProfiles) {
                        return data.usageProfiles;
                    }
                }
            )
        );
    }
}