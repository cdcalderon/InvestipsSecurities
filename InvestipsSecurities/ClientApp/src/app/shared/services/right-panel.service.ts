import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { RightPanelSignal } from "../models/right-panel-signal.model";

@Injectable({
    providedIn: "root"
})
export class RightPanelService {
    signalsInScope: RightPanelSignal[] = [];
    signalChanged$ = new ReplaySubject<RightPanelSignal[]>(1);
    constructor() {}

    signalsChanged(signals: RightPanelSignal[]) {
        this.signalsInScope = signals;
        this.signalChanged$.next(this.signalsInScope);
    }
}
