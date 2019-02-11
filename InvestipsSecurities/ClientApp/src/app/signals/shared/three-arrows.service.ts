import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { ThreeArrowSignalInfo } from '../shared/three-arrow-signal-info.model';

@Injectable({
    providedIn: 'root'
})
export class ThreeArrowsService {
    // private _stockEQuotesUrl = 'http://localhost:4000/api/threearrowsignals';
    private _stockQuotesAndIndicatorsApiUrlBase = environment.stockMarketQuotesWithIndicatorsApiBaseUrl;
    constructor(private http: HttpClient) { }

    getStockSignals(from: Date, to: Date, pagingInfo: any, gapsQuery: any): Observable<ThreeArrowSignalInfo> {
        // var headers = new Headers();
        // headers.append('Content-Type', 'application/json');
        const params = new URLSearchParams();
        let toDate: any;
        let fromDate: any;
        if (!from || !to) {
            toDate = this.monthAdd(new Date(), 0);
            fromDate = this.monthAdd(new Date(), -10);
        } else {
            fromDate = this.monthAdd(from, 0);
            toDate = this.monthAdd(to, 0);
        }

        const dbQuery = {
            query: gapsQuery,
            exchange: 'NasdaqNM',
            pagingInfo: pagingInfo,
            from: fromDate,
            to: toDate
        };

        return this.http.post<ThreeArrowSignalInfo>(`${this._stockQuotesAndIndicatorsApiUrlBase}/api/threearrowsignals/filter`, dbQuery)
            .pipe(
                map(response => {
                    return <ThreeArrowSignalInfo>response;
                }),
                tap(data => console.log('Three arrow Signals: ' + JSON.stringify(data))),
                catchError(this.handleError)
            );
        // .map((response: Response) => {
        //     return <ISignalsThreeArrow>response.json();
        // })
        // .do(data => console.log('Three arrow Signals: ' + JSON.stringify(data)))
        // .catch(this.handleError);
    }


    getGroupedSignalsBySymbol(stockSignals: ThreeArrowSignalInfo) {
        return _(stockSignals.docs)
            .groupBy(x => x.symbol)
            .map((value, key) => ({
                symbol: key,
                quantity: value.length,
                signals: value,
                close: value[value.length - 1].close
            }))
            .value();
    }

    private handleError(err: HttpErrorResponse) {
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

    monthAdd(date, month) {
        let temp;
        temp = new Date(date.getFullYear(), date.getMonth(), 1);
        temp.setMonth(temp.getMonth() + (month + 1));
        temp.setDate(temp.getDate() - 1);
        if (date.getDate() < temp.getDate()) {
            temp.setDate(date.getDate());
        }

        return temp / 1000;

    }
}
