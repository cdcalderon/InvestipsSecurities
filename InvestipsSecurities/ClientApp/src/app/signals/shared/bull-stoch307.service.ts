import { Injectable } from '@angular/core'
import { Http, Response, URLSearchParams, Headers } from '@angular/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import * as _ from 'lodash';
import { ISignalsStoch307Info } from './stoch307-signal-info.model';

@Injectable({
    providedIn: 'root'
})
export class BullStoch307Service {
    private _stockQuotesAndIndicatorsApiUrlBase = environment.stockMarketQuotesWithIndicatorsApiBaseUrl;

    constructor(private _http: HttpClient) { }

    getStoch307Signals(from: Date, to: Date, pagingInfo: any, gapsQuery: any): Observable<ISignalsStoch307Info> {
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
            `${this._stockQuotesAndIndicatorsApiUrlBase}/api/signals/stoch307/bullwithfilter`, dbQuery)
            .pipe(
                map(response => {
                    return <ISignalsStoch307Info>response;
                }),
                tap(data => console.log('Stoch 307 Signals: ' + JSON.stringify(data))),
                catchError(this.handleError)
            )
    }


    getGroupedStoch307BySymbol(stockSignals: ISignalsStoch307Info) {
        return _(stockSignals.docs)
            .groupBy(x => x.symbol)
            .map((value, key) => ({
                symbol: key,
                exchange: value[0].exchange,
                sector: value[0].sector,
                industry: value[0].industry,
                marketCap: value[0].marketCap,
                //movingExAvg30PositiveSlope: value.movingExAvg30PositiveSlope,
                signals: value,
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
