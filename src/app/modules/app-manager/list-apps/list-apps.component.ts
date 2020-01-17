/**
 * @description Basic Layout component for viewing app lists
 * @author Steven M. Redman
 */

import { Component, OnInit } from "@angular/core";
import { Breadcrumb } from "../../display-elements/breadcrumb.model";
import { BreadcrumbsService } from "../../display-elements/breadcrumbs.service";
import { VendorsService } from '../../../services/vendors.service';
import { ApiSearchResult } from "src/app/models/api-search-result.model";
import { ApiSearchCriteria } from "../../../models/api-search-criteria.model";
import { Vendor } from '../../../models/vendor.model';

@Component({
  selector: "app-list-apps",
  templateUrl: "./list-apps.component.html",
  styleUrls: ["./list-apps.component.scss"]
})
export class ListAppsComponent implements OnInit {
  vendors: any;
  vendorCount: number;

  constructor(private crumbsSvc: BreadcrumbsService, private vendorSvc: VendorsService) {
    this.vendors = {};
    this.vendorCount = 0;
  }

  ngOnInit() {
    this.generateCrumbs();
    this.listVendors();
  }

  saveCustomAttributes(cards: CustomAttributeInfo[]) {
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

  protected listVendors(page = 0): void {
    this.vendorSvc.listVendors(new ApiSearchCriteria({}, page, 'name', 'asc')).subscribe(
      (result: ApiSearchResult<Vendor>) => {
        result.data.forEach((v: Vendor) => {
          this.vendors[v.docId] = v.name;
        });
        this.vendorCount += result.data.length;
        if (result.totalRecords > this.vendorCount) {
          this.listVendors(page + 1);
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
