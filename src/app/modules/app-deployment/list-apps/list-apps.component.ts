import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';
import {VendorsService} from '../../../services/vendors.service';
import {AppsService} from '../../../services/apps.service';
import {Vendor} from '../../../models/vendor.model';
import {App} from '../../../models/app.model';

@Component({
  selector: 'app-list-apps',
  templateUrl: './list-apps.component.html',
  styleUrls: ['./list-apps.component.scss']
})
export class ListAppsComponent implements OnInit, OnDestroy {

  activeVendorSub: Subscription;
  activeVendor: Vendor;

  constructor(
    private appsSvc: AppsService,
    private vendorsSvc: VendorsService) { }

  ngOnInit() {
    this.subscribeToActiveVendor();
  }

  ngOnDestroy() {
    this.activeVendorSub.unsubscribe();
  }

  private subscribeToActiveVendor(): void {
    this.activeVendorSub = this.vendorsSvc.activeVendorSubject.subscribe(
      (vendor: Vendor) => {
        console.log(vendor);
        if (vendor) {
          this.activeVendor = vendor;
          this.listApps();
        }
      }
    );
  }

  private listApps(): void {
    this.appsSvc.listVendorApps(this.activeVendor.docId).subscribe(
        (apps: Array<App>) => {
          console.log(apps);
        },
        (err: any) => {
          console.log(err);
        }
    );
  }

}
