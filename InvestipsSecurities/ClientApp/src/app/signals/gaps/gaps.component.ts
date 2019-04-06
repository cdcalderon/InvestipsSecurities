import { Component, OnInit, ViewChild } from "@angular/core";
import { GapService } from "../shared/gap.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IGapSignal } from "../shared/gap-signal";
import { ISignalsGapInfo } from "../shared/gap-signal-info";
import * as _ from "lodash";
import { SelectItem, Paginator } from "primeng/primeng";
import { SecurityFilterCriteria } from "../../shared/models/security-filter-criteria.model";
import {
    trigger,
    state,
    style,
    transition,
    animate
} from "@angular/animations";

@Component({
    selector: "app-gaps",
    templateUrl: "./gaps.component.html",
    styleUrls: ["./gaps.component.css"],
    animations: [
        trigger("rowExpansionTrigger", [
            state(
                "void",
                style({
                    transform: "translateX(-10%)",
                    opacity: 0
                })
            ),
            state(
                "active",
                style({
                    transform: "translateX(0)",
                    opacity: 1
                })
            ),
            transition(
                "* <=> *",
                animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")
            )
        ])
    ]
})
export class GapsComponent implements OnInit {
    @ViewChild("paginator") paginator: Paginator;
    pageSize = 25;
    currentPage = 1;
    totalSignalsInCurrentPage: number;
    totalGaps = 0;
    numberOfPages: number;
    errorMessage: string;
    gapSignals: ISignalsGapInfo;
    selectedGapSignal: IGapSignal;
    groupedSignals: any;
    filterCriteria: SecurityFilterCriteria;
    cols: any[];

    exchanges: SelectItem[] = [
        { label: "NYSE", value: "nyse" },
        { label: "NASDAQ", value: "nasdaq" },
        { label: "AMEX", value: "amex" }
    ];

    gapsQuery: any = {};
    constructor(
        private _gapSignalsService: GapService,
        private _router: Router
    ) {}

    ngOnInit() {
        this.cols = [
            { field: "symbol", header: "Symbol" },
            { field: "close", header: "Last Signal Close" },
            { field: "quantity", header: "Quantity" }
        ];

        const pagingInfo = {
            pageSize: this.pageSize,
            currentPage: this.currentPage
        };

        this._gapSignalsService
            .getGapSignals(null, null, pagingInfo, {})
            .subscribe(
                stockSignals => {
                    this.gapSignals = stockSignals;
                    this.groupedSignals = _.orderBy(
                        this._gapSignalsService.getGroupedSignalsBySymbol(
                            this.gapSignals
                        ),
                        ["close"],
                        ["desc"]
                    );
                    this.totalGaps = stockSignals.total;
                    this.numberOfPages = Math.ceil(
                        stockSignals.total / this.pageSize
                    );
                    this.totalSignalsInCurrentPage = stockSignals.docs.length;
                    console.log(this.totalGaps);
                    console.log(this.groupedSignals);
                },
                error => (this.errorMessage = <any>error)
            );
    }

    onSignalSelect(event) {
        console.log(event.data);
        this._router.navigate(["/marketchart", event.data.symbol, "gap"]);
    }

    paginate(event) {
        this.currentPage = event.page + 1;
        console.log(event);
        this.searchGaps(this.filterCriteria, "paginator");
    }

    navigateToChart(signal: any) {
        console.log(signal.symbol);
        this._router.navigate(["/marketchart", signal.symbol, "gap"]);
    }

    searchGaps(filterCriteria: SecurityFilterCriteria, source: string) {
        if (source === "filter") {
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

        this._gapSignalsService
            .getGapSignals(from, to, pagingInfo, this.gapsQuery)
            .subscribe(
                stockSignals => {
                    this.gapSignals = stockSignals;
                    this.groupedSignals = _.orderBy(
                        this._gapSignalsService.getGroupedSignalsBySymbol(
                            this.gapSignals
                        ),
                        ["close"],
                        ["desc"]
                    );
                    this.totalGaps = stockSignals.total;
                    this.numberOfPages = Math.ceil(
                        stockSignals.total / this.pageSize
                    );
                    this.totalSignalsInCurrentPage = stockSignals.docs.length;
                    console.log(this.totalGaps);
                    console.log(this.groupedSignals);

                    // this.groupedSignals = this.signalAppender(this.currentPage,
                    //     this.totalGaps, this.pageSize, this.groupedSignals);
                },
                error => (this.errorMessage = <any>error)
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
