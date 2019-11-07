import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UsageProfileService {

    private porifleUrl = environment.baseUrl + 'usage-profile/';

    constructor(
        private http: HttpClient
    ) { }

    search(): Observable<any> {
        const filters = {};
        return this.http.post(this.porifleUrl + 'search', filters).pipe(
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