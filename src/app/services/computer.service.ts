import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ComputerService {

    private computerUrl = environment.baseUrl + 'computer/';

    constructor(
        private http: HttpClient
    ) { }

    get(id): Observable<any> {
        return this.http.get(this.computerUrl + id).pipe(
            map(
                (data: any) => {
                    if (data.computer) {
                        return data.computer;
                    }
                }
            )
        );
    }

    addComment(comment, computerId): Observable<any> {
        return this.http.post(this.computerUrl + 'addComment', {
            comment,
            computerId
        }).pipe(
            map(
                (data: any) => {
                    if (data.computer) {
                        return data.computer;
                    }
                }
            )
        );
    }

    search(filters: any): Observable<any> {
        return this.http.post(this.computerUrl + 'search', {
            filters
        }).pipe(
            map(
                (data: any) => {
                    if (data.computers) {
                        return data.computers;
                    }
                }
            )
        );
    }

    searchBestComputersByFilters(params: any): Observable<any> {
        return this.http.post(this.computerUrl + 'search-by-score', {
            answers: params.answers,
            usageProfiles: params.usageProfiles,
            type: params.type,
            isNewSearch: params.isNewSearch
        }).pipe(
            map(
                (data: any) => {
                    if (data.computers) {
                        return data.computers;
                    }
                }
            )
        );
    }
}
