/**
 * @description Basic Layout component for viewing app lists
 * @author Steven M. Redman
 */

import { Component, OnInit } from "@angular/core";
import { Breadcrumb } from "../../display-elements/breadcrumb.model";
import { BreadcrumbsService } from "../../display-elements/breadcrumbs.service";

@Component({
  selector: "app-list-apps",
  templateUrl: "./list-apps.component.html",
  styleUrls: ["./list-apps.component.scss"]
})
export class ListAppsComponent implements OnInit {
  attributes: CustomAttributeInfo[] = [];

  constructor(private crumbsSvc: BreadcrumbsService) {}

  ngOnInit() {
    this.generateCrumbs();

    const customAttributes =
      localStorage.getItem("customAttributes-list") || "[]";
    this.attributes = JSON.parse(customAttributes);
  }

  saveCustomAttributes(cards: CustomAttributeInfo[]) {
    console.log(cards);
    localStorage.setItem("customAttributes-list", JSON.stringify(cards));
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: "/portal"
      },
      {
        title: "MicroApp Manager",
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }
}
