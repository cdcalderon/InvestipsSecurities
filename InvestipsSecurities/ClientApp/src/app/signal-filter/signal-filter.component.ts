import { Component, EventEmitter, Output, Input } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { StockSymbolsService } from '../shared/services/stock-symbols.service';
import { SecurityFilterCriteria } from '../shared/models/security-filter-criteria.model';

@Component
    ({
        selector: 'app-signal-filter',
        templateUrl: './signal-filter.component.html'
    })
export class SignalFilterComponent {
    selectedSymbols: string[] = [];
    selectedExchanges: string[] = [];
    selectedCaps: string[] = [];

    errorMessage: string;
    @Output() applyFilter = new EventEmitter<any>();


    exchanges: SelectItem[] = [
        { label: 'NYSE', value: 'nyse' },
        { label: 'NASDAQ', value: 'nasdaq' },
        { label: 'AMEX', value: 'amex' }
    ];

    rangeValues: number[] = [1, 1000];
    caps: SelectItem[] = [
        { label: 'Small', value: 's' },
        { label: 'Mid', value: 'm' },
        { label: 'Large', value: 'l' }
    ];

    filteredSymbolsMultiple: any[];
    gapsQuery: any = {};

    fromFilter: any;
    toFilter: any;

    constructor(private _stockSymbolsService: StockSymbolsService) { }

    filterSignals() {
        const filterCriterial: SecurityFilterCriteria = {
            symbols: this.selectedSymbols,
            exchanges: this.selectedExchanges,
            caps: this.selectedCaps,
            from: this.fromFilter,
            to: this.toFilter,
            lowPriceRange: this.rangeValues[0],
            highPriceRange: this.rangeValues[1]
        };

        this.applyFilter.emit(filterCriterial);
    }

    filterSymbolsMultiple(event) {
        this.filteredSymbolsMultiple = [];
        this._stockSymbolsService.getSymbols(event.query)
            .subscribe(symbols => {
                this.filteredSymbolsMultiple = symbols;
            },
                error => this.errorMessage = <any>error
            );
    }
}
