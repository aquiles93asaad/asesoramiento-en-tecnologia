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

    search(): Observable<any> {
        const filters = {};
        return this.http.post(this.computerUrl + 'search', filters).pipe(
            map(
                (data: any) => {
                    if (data.computers) {
                        return data.computers;
                    }
                }
            )
        );
    }

    searchBestComputersByFilters(answers: any, profiles?: any, filters?: any): Observable<any> {
        return this.http.post(this.computerUrl + 'search-by-score', {
            answers,
            profiles,
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
}
