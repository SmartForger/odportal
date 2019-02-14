import { Component, OnInit, OnDestroy } from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {VendorsService} from '../../../services/vendors.service';
import {App} from '../../../models/app.model';
import {Vendor} from '../../../models/vendor.model';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-edit-app-main',
  templateUrl: './edit-app-main.component.html',
  styleUrls: ['./edit-app-main.component.scss']
})
export class EditAppMainComponent implements OnInit, OnDestroy {

  app: App;
  activeVendorSub: Subscription;

  constructor(
    private appsSvc: AppsService,
    private vendorsSvc: VendorsService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscribeToActiveVendor();
  }

  ngOnDestroy() {
    this.activeVendorSub.unsubscribe();
  }

  private subscribeToActiveVendor(): void {
    this.activeVendorSub = this.vendorsSvc.activeVendorSubject.subscribe(
        (vendor: Vendor) => {
          if (vendor) {
            this.fetchApp(vendor.docId);
          }
        }
    );
  }

  private fetchApp(vendorId: string): void {
    this.appsSvc.fetchVendorApp(vendorId, this.route.snapshot.params['id']).subscribe(
      (app: App) => {
        this.app = app;
        console.log(app);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
