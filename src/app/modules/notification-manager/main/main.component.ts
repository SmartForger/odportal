import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from "../../display-elements/breadcrumb.model";
import { BreadcrumbsService } from "../../display-elements/breadcrumbs.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private crumbsSvc: BreadcrumbsService) { }

  ngOnInit() {
    this.generateCrumbs();
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: "/portal"
      },
      {
        title: "Notification Manager",
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }
}
