import { Component, OnInit } from '@angular/core';
import {Vendor} from '../../../models/vendor.model';
import {VendorsService} from '../../../services/vendors.service';
import {AuthService} from '../../../services/auth.service';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';

@Component({
  selector: 'app-list-vendors',
  templateUrl: './list-vendors.component.html',
  styleUrls: ['./list-vendors.component.scss']
})
export class ListVendorsComponent implements OnInit {

  vendors: Array<Vendor>;

  constructor(
    private vendorsSvc: VendorsService, 
    private authSvc: AuthService,
    private crumbsSvc: BreadcrumbsService) { 
      this.vendors = new Array<Vendor>();
    }

  ngOnInit() {
    this.listVendors();
    this.generateCrumbs();
  }

  private listVendors(): void {
    this.vendorsSvc.listVendorsByUserId(this.authSvc.getUserId()).subscribe(
      (vendors: Array<Vendor>) => {
        this.vendors = vendors;
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
