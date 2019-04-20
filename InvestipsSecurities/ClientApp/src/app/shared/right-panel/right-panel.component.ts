import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { AppComponent } from "../../app.component";
import { ScrollPanel } from "primeng/primeng";
import { RightPanelService } from "../services/right-panel.service";
import { RightPanelSignal } from "../models/right-panel-signal.model";
import { Router } from "@angular/router";

@Component({
    selector: "app-rightpanel",
    templateUrl: "./right-panel.component.html"
})
export class AppRightpanelComponent implements AfterViewInit, OnInit {
    @ViewChild("scrollRightPanel") rightPanelMenuScrollerViewChild: ScrollPanel;

    signalsInScope: RightPanelSignal[];
    constructor(
        public app: AppComponent,
        private _rightPanelService: RightPanelService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        const sessionSignals: any = sessionStorage.getItem("rightPanelSignals");

        if (sessionSignals) {
            this.signalsInScope = JSON.parse(sessionSignals);
        }

        this._rightPanelService.signalChanged$.subscribe(signals => {
            this.signalsInScope = signals;
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.rightPanelMenuScrollerViewChild.moveBar();
        }, 100);
    }

    onSignalSelected(signal) {
        window.location.href = `http://localhost:4200/#/marketchart/${
            signal.symbol
        }/gap`;
        location.reload();
    }
}
