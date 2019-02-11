import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Security } from '../models/security.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SecuritiesService {
    private _securityUrl = `${environment.stockMarketUDFApiBaseUrl}/api/securities/filter`;

    constructor(private http: HttpClient) { }

    getSecurities(filterQuery: any): Observable<Security[]> {
        // let headers = new HttpHeaders().set('Content-Type', 'application/json');
        // headers = headers.set('Content-Type', 'application/json');

        // //var headers = new Headers();
        // headers.append('Content-Type', 'application/json');
        // const params = new URLSearchParams();

        return this.http.post<Security[]>(this._securityUrl, filterQuery)
            .pipe(
                map(securities => {
                    return securities;
                }),
                tap(data => console.log('All: ' + JSON.stringify(data))),
                catchError(this.handleError)
            );
    }

    private handleError(err: HttpErrorResponse) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let errorMessage: string;
        if (err.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMessage = `Backend returned code ${err.status}: ${err.error}`;
        }
        console.error(err);
        return throwError(errorMessage);
    }
}
