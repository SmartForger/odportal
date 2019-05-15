/**
 * @description Lists vendors to which the logged-in user is assigned
 * @author Steven M. Redman
 */

import { Component, OnInit } from '@angular/core';
import {Vendor} from '../../../models/vendor.model';
import {VendorsService} from '../../../services/vendors.service';
import {AuthService} from '../../../services/auth.service';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import {ApiSearchResult} from '../../../models/api-search-result.model';
import {SSPList} from '../../../base-classes/ssp-list';

@Component({
  selector: 'app-list-vendors',
  templateUrl: './list-vendors.component.html',
  styleUrls: ['./list-vendors.component.scss']
})
export class ListVendorsComponent extends SSPList<Vendor> implements OnInit {

  constructor(
    private vendorsSvc: VendorsService, 
    private authSvc: AuthService,
    private crumbsSvc: BreadcrumbsService) { 
      super(
        new Array<string>(
          "status", "name", "phone", "email", "users", "created", "actions"
        ),
        new ApiSearchCriteria(
          {name: ""}, 0, "name", "asc"
        )
      );
    }

  ngOnInit() {
    this.listItems();
    this.generateCrumbs();
  }

  listItems(): void {
    this.vendorsSvc.listVendorsByUserId(this.authSvc.getUserId(), this.searchCriteria).subscribe(
      (results: ApiSearchResult<Vendor>) => {
        this.items = results.data;
        this.paginator.length = results.totalRecords;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: '/portal'
      },
      {
        title: "MicroApp Deployment",
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

}
