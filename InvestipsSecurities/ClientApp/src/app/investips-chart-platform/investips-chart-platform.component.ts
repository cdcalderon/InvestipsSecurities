import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-investips-chart-platform",
    templateUrl: "./investips-chart-platform.component.html",
    styleUrls: ["./investips-chart-platform.component.css"]
})
export class InvestipsChartPlatformComponent implements OnInit {
    marksType: string;
    stockSymbol: string;
    selectedNavSymbol: string;
    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.selectedNavSymbol = this.route.snapshot.params["id"];
        this.marksType = this.route.snapshot.params["marktype"];
    }
}
