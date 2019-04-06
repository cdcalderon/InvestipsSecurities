import { Component, OnInit, ViewChild } from '@angular/core';
import { BullStoch307Service } from '../shared/bull-stoch307.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IStoch307Signal } from '../shared/stoch307-signal.model';
import { ISignalsStoch307Info } from '../shared/stoch307-signal-info.model';
import * as _ from 'lodash';
import { SelectItem, Paginator } from 'primeng/primeng';
import { SecurityFilterCriteria } from '../../shared/models/security-filter-criteria.model';

@Component({
    selector: 'app-bull-stoch307',
    templateUrl: './bull-stoch307.component.html',
    styleUrls: ['./bull-stoch307.component.css']
})
export class BullStoch307Component implements OnInit {
    @ViewChild('paginator') paginator: Paginator;
    pageSize = 25;
    currentPage = 1;
    totalSignalsInCurrentPage: number;
    totalGaps = 0;
    numberOfPages: number;
    errorMessage: string;
    gapSignals: ISignalsStoch307Info;
    selectedGapSignal: IStoch307Signal;
    groupedSignals: any;
    filterCriteria: SecurityFilterCriteria;

    exchanges: SelectItem[] = [
        { label: 'NYSE', value: 'nyse' },
        { label: 'NASDAQ', value: 'nasdaq' },
        { label: 'AMEX', value: 'amex' }
    ];

    gapsQuery: any = {};
    constructor(private stoch307SignalsService: BullStoch307Service,
        private _router: Router) { }

    ngOnInit() {
        const pagingInfo = {
            pageSize: this.pageSize,
            currentPage: this.currentPage
        };

        this.stoch307SignalsService.getStoch307Signals(null, null, pagingInfo, {})
            .subscribe(
                stockSignals => {
                    this.gapSignals = stockSignals;
                    this.groupedSignals =
                        _.orderBy(this.stoch307SignalsService.getGroupedStoch307BySymbol(this.gapSignals), ['close'], ['desc']);
                    this.totalGaps = stockSignals.total;
                    this.numberOfPages = Math.ceil(stockSignals.total / this.pageSize);
                    this.totalSignalsInCurrentPage = stockSignals.docs.length;
                    console.log(this.totalGaps);
                    console.log(this.groupedSignals);

                },
                error => this.errorMessage = <any>error
            );
    }

    onSignalSelect(event) {
        console.log(event.data);
        this._router.navigate(['/marketchart', event.data.symbol, 'stoch307bull']);
    }

    paginate(event) {
        this.currentPage = event.page + 1;
        console.log(event);
        this.searchGaps(this.filterCriteria, 'paginator');
    }

    navigateToChart(signal: any) {
        console.log(signal.symbol);
        this._router.navigate(['/marketchart', signal.symbol, 'stoch307bull']);
    }

    searchGaps(filterCriteria: SecurityFilterCriteria, source: string) {
        if (source === 'filter') {
            this.currentPage = 1;
            this.paginator.first = 0;
        }

        this.filterCriteria = filterCriteria;

        this.gapsQuery = this.createQueryFilter(this.filterCriteria);
        const from = filterCriteria != null ? filterCriteria.from : null;
        const to = filterCriteria != null ? filterCriteria.to : null;
        const pagingInfo = {
            pageSize: this.pageSize,
            currentPage: this.currentPage
        };

        this.stoch307SignalsService.getStoch307Signals(from, to, pagingInfo, this.gapsQuery)
            .subscribe(
                stockSignals => {
                    this.gapSignals = stockSignals;
                    this.groupedSignals =
                        _.orderBy(this.stoch307SignalsService.getGroupedStoch307BySymbol(this.gapSignals), ['close'], ['desc']);
                    this.totalGaps = stockSignals.total;
                    this.numberOfPages = Math.ceil(stockSignals.total / this.pageSize);
                    this.totalSignalsInCurrentPage = stockSignals.docs.length;
                    console.log(this.totalGaps);
                    console.log(this.groupedSignals);

                    // this.groupedSignals = this.signalAppender(this.currentPage,
                    //     this.totalGaps, this.pageSize, this.groupedSignals);
                },
                error => this.errorMessage = <any>error
            );

    }

    createQueryFilter(filterCriterial: SecurityFilterCriteria) {
        const queryFilter: any = {};
        if (filterCriterial) {
            if (filterCriterial.exchanges.length > 0) {
                queryFilter.exchanges = filterCriterial.exchanges;
            }
            if (filterCriterial.caps.length > 0) {
                queryFilter.marketCaps = filterCriterial.caps;
            }
            if (filterCriterial.symbols.length > 0) {
                queryFilter.symbols = filterCriterial.symbols;
            }
            if (filterCriterial.lowPriceRange > 0) {
                queryFilter.lowPriceRange = filterCriterial.lowPriceRange;
            }
            if (filterCriterial.highPriceRange > 0) {
                queryFilter.highPriceRange = filterCriterial.highPriceRange;
            }
        }
        return queryFilter;
    }

}
