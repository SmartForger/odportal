import { Component, OnInit } from '@angular/core';
import {Vendor} from '../../../models/vendor.model';
import {VendorsService} from '../../../services/vendors.service';

@Component({
  selector: 'app-list-vendors',
  templateUrl: './list-vendors.component.html',
  styleUrls: ['./list-vendors.component.scss']
})
export class ListVendorsComponent implements OnInit {

  vendors: Array<Vendor>;

  constructor(private vendorsSvc: VendorsService) { 
    this.vendors = new Array<Vendor>();
  }

  ngOnInit() {
    this.listVendors();
  }

  private listVendors(): void {
    this.vendorsSvc.listVendors().subscribe(
      (vendors: Array<Vendor>) => {
        this.vendors = vendors;
      },
      (err: any) =>{
        console.log(err);
      }
    );
  }

}
