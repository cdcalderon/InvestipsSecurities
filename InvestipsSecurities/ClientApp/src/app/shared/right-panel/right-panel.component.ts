import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { AppComponent } from "../../app.component";
import { ScrollPanel } from "primeng/primeng";

@Component({
    selector: "app-rightpanel",
    templateUrl: "./right-panel.component.html"
})
export class AppRightpanelComponent implements AfterViewInit {
    @ViewChild("scrollRightPanel") rightPanelMenuScrollerViewChild: ScrollPanel;

    constructor(public app: AppComponent) {}

    ngAfterViewInit() {
        setTimeout(() => {
            this.rightPanelMenuScrollerViewChild.moveBar();
        }, 100);
    }
}
