import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { AppComponent } from "../../app.component";
import { ScrollPanel } from "primeng/primeng";
import { RightPanelService } from "../services/right-panel.service";
import { RightPanelSignal } from "../models/right-panel-signal.model";

@Component({
    selector: "app-rightpanel",
    templateUrl: "./right-panel.component.html"
})
export class AppRightpanelComponent implements AfterViewInit, OnInit {
    @ViewChild("scrollRightPanel") rightPanelMenuScrollerViewChild: ScrollPanel;

    signalsInScope: RightPanelSignal[];
    constructor(
        public app: AppComponent,
        private _rightPanelService: RightPanelService
    ) {}

    ngOnInit(): void {
        this._rightPanelService.signalChanged$.subscribe(signals => {
            this.signalsInScope = signals;
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.rightPanelMenuScrollerViewChild.moveBar();
        }, 100);
    }
}
