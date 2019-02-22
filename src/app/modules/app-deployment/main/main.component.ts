import { Component, OnInit, OnDestroy } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {Subscription} from 'rxjs';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {Router} from '@angular/router';
import {VendorsService} from '../../../services/vendors.service';
import {Vendor} from '../../../models/vendor.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  vendor: Vendor;
  private vendorBroker: AppPermissionsBroker;
  private appBroker: AppPermissionsBroker;
  private sessionUpdateSub: Subscription;

  constructor(
    private authSvc: AuthService,
    private vendorsSvc: VendorsService,
    private notifySvc: NotificationService,
    private router: Router) { 
      this.vendorBroker = new AppPermissionsBroker('vendor-manager');
      this.appBroker = new AppPermissionsBroker('micro-app-deployment');
    }

  ngOnInit() {
    this.verifyAppAccess();
    this.fetchVendor();
    this.subscribeToSessionUpdate();
  }

  ngOnDestroy() {
    this.sessionUpdateSub.unsubscribe();
    this.vendorsSvc.setActiveVendor(null);
  }

  private verifyAppAccess(): void {
    if (!this.vendorBroker.hasPermission("Read") || !this.appBroker.hasPermission("Read")) {
      this.notifyAndRedirect("You were redirected because you do not have the 'Read' permission");
    }
  }

  private subscribeToSessionUpdate(): void {
    this.sessionUpdateSub = this.authSvc.sessionUpdatedSubject.subscribe(
      (userId: string) => {
        if (userId === this.authSvc.getUserId()) {
          this.verifyAppAccess();
        }
      }
    );
  }

  private fetchVendor(): void {
    this.vendorsSvc.fetchVendorByBearerToken().subscribe(
      (vendor: Vendor) => {
        this.vendor = vendor;
        this.vendorsSvc.setActiveVendor(vendor);
      },
      (err: any) => {
        console.log(err);
        this.notifyAndRedirect("You were redirected because no Vendor account was found");
      }
    );
  }

  private notifyAndRedirect(message: string): void {
    this.notifySvc.notify({
      type: NotificationType.Warning,
      message: message
    });
    this.router.navigateByUrl('/portal');
  }

}
