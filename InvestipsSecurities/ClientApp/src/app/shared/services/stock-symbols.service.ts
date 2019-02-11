import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class StockSymbolsService {
    private stockUDFApiUrlBase = environment.stockMarketUDFApiBaseUrl;
    // private symbsymbolsURLolsURL = 'http://localhost:4600';
    constructor(private http: HttpClient) { }

    getSymbols(partial: string): Observable<string[]> {
        return this.http.get<string[]>(`${this.stockUDFApiUrlBase}/api/udf/symbolspartial?part=${partial}`)
            .pipe(
                map(response => {
                    return response;
                }),
                tap(data => console.log('filterted Symbols: ' + JSON.stringify(data))),
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
