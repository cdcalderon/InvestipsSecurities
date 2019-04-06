import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { IGapSignal } from '../shared/gap-signal';
import { ISignalsGapInfo } from '../shared/gap-signal-info';
import { environment } from '../../../environments/environment';

import * as _ from 'lodash';
import { IGapQuote } from '../shared/gap-quote';


@Injectable({
    providedIn: 'root'
})
export class GapService {

    private _stockQuotesAndIndicatorssUrlBase = environment.stockMarketQuotesWithIndicatorsApiBaseUrl;
    //private _gapsHistoricals = 'https://warm-journey-46979.herokuapp.com/api/udf/historicalgaps';
    // private _gapsHistoricals = 'http://localhost:4000/api/udf/historicalgaps';

    constructor(private _http: HttpClient) { }

    getGapSignals(from: Date, to: Date, pagingInfo: any, gapsQuery: any): Observable<ISignalsGapInfo> {
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

        return this._http.post(
            `${this._stockQuotesAndIndicatorssUrlBase}/api/gapsignals/filter`, dbQuery)
            .pipe(
                map(response => {
                    return <ISignalsGapInfo>response;
                }),
                tap(data => console.log('All Signals: ' + JSON.stringify(data))),
                catchError(this.handleError)
            );
    }

    getHistoricalGaps(from: string, to: string, symbol: string): Observable<IGapQuote[]> {
        // let headers = new HttpHeaders();

        let params = new HttpParams();
        params = params.append('to', to);
        params = params.append('from', from);
        params = params.append('symbol', symbol);

        // const params = new URLSearchParams();
        // params.set('to', to);
        // params.set('from', from);
        // params.set('symbol', symbol);

        return this._http.get(
            `${this._stockQuotesAndIndicatorssUrlBase}/api/udf/historicalgaps`, { params })
            .pipe(
                map(response => {
                    return <IGapQuote[]>response;
                }),
                tap(data => console.log('All Signals: ' + JSON.stringify(data))),
                catchError(this.handleError)
            );
    }

    getGroupedSignalsBySymbol(stockSignals: ISignalsGapInfo) {
        return _(stockSignals.docs)
            .groupBy(x => x.symbol)
            .map((value, key) => ({
                symbol: key,
                exchange: value[0].exchange,
                sector: value[0].sector,
                industry: value[0].industry,
                marketCap: value[0].marketCap,
                signals: value,
                quantity: value.length,
                close: value[value.length - 1].close
            }))
            .value();
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server Error');
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
