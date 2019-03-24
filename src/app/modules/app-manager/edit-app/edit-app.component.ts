import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import {App} from '../../../models/app.model';
import {AppsService} from '../../../services/apps.service';
import {ActivatedRoute} from '@angular/router';
import {NotificationType} from '../../../notifier/notificiation.model';
import {NotificationService} from '../../../notifier/notification.service';
import {ModalComponent} from '../../display-elements/modal/modal.component';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {AuthService} from '../../../services/auth.service';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {Subscription, from} from 'rxjs';
import {Cloner} from '../../../util/cloner';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edit-app',
  templateUrl: './edit-app.component.html',
  styleUrls: ['./edit-app.component.scss']
})
export class EditAppComponent implements OnInit, OnDestroy {

  app: App;
  canUpdate: boolean;
  canDelete: boolean;
  showApproveModal: boolean;
  private broker: AppPermissionsBroker;
  private sessionUpdatedSub: Subscription;

  @ViewChild('enableModal') private enableModal: ModalComponent;
  @ViewChild('disableModal') private disableModal: ModalComponent;
  @ViewChild('deleteModal') private deleteModal: ModalComponent;
  @ViewChild('enableTrustedModal') private enableTrustedModal: ModalComponent;
  @ViewChild('disableTrustedModal') private disableTrustedModal: ModalComponent;

  constructor(
    private appsSvc: AppsService, 
    private route: ActivatedRoute,
    private notifySvc: NotificationService,
    private crumbsSvc: BreadcrumbsService,
    private authSvc: AuthService,
    private router: Router) { 
      this.canUpdate = false;
      this.canDelete = false;
      this.showApproveModal = false;
      this.broker = new AppPermissionsBroker("micro-app-manager");
  }

  ngOnInit() {
    this.setPermissions();
    this.fetchApp();
    this.subscribeToSessionUpdate();
  }

  ngOnDestroy() {
    this.sessionUpdatedSub.unsubscribe();
  }

  private setPermissions(): void {
    this.canUpdate = this.broker.hasPermission("Update");
    this.canDelete = this.broker.hasPermission("Delete");
  }

  private subscribeToSessionUpdate(): void {
    this.sessionUpdatedSub = this.authSvc.sessionUpdatedSubject.subscribe(
      (userId: string) => {
        if (userId === this.authSvc.getUserId()) {
          this.setPermissions();
        }
      }
    );
  }

  enableButtonClicked(enable: boolean): void {
    this.showEnableOrDisableModal(enable);
  }

  trustedButtonClicked(enable: boolean): void {
    this.showEnableOrDisableTrustedModal(enable);
  }

  enableConfirmed(btnText: string, enable: boolean): void {
    this.hideEnableOrDisableModal(enable);
    this.app.enabled = enable;
    this.appsSvc.update(this.app).subscribe(
      (app: App) => {
        let message: string = this.app.appTitle + " was ";
        if (enable) {
          message += "enabled successfully";
        }
        else {
          message += "disabled successfully";
        }
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: message
        });
        this.appsSvc.appUpdated(app);
      },
      (err: any) => {
        let message: string = "There was a problem while ";
        if (enable) {
          message += "enabling " + this.app.appTitle;
        }
        else {
          message += "disabling " + this.app.appTitle;
        }
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: message
        });
      }
    );
  }

  trustedConfirmed(btnText: string, enable: boolean): void {
    this.hideEnableOrDisableTrustedModal(enable);
    this.app.trusted = enable;
    this.appsSvc.update(this.app).subscribe(
      (app: App) => {
        let message: string = `Trusted mode for ${this.app.appTitle} was `;
        if (enable) {
          message += "enabled successfully";
        }
        else {
          message += "disabled successfully";
        }
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: message
        });
        this.appsSvc.appUpdated(app);
      },
      (err: any) => {
        let message: string = "There was a problem while ";
        if (enable) {
          message += `enabling Trusted mode for ${this.app.appTitle}`;
        }
        else {
          message += `disabling Trusted mode for ${this.app.appTitle}`;
        }
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: message
        });
      }
    );
  }

  removeApp(): void {
    this.deleteModal.show = true;
  }

  confirmRemoval(): void {
    this.deleteModal.show = false;
    this.appsSvc.delete(this.app.docId).subscribe(
      (app: App) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: `${this.app.appTitle} was delete successfully`
        });
        this.appsSvc.appUpdated(app);
        this.router.navigateByUrl('/portal/app-manager');
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: `There was a problem while deleting${this.app.appTitle}`
        });
      }
    );
  }

  approveApp(): void {
    this.showApproveModal = true;
  }

  confirmApproval(): void {
    this.showApproveModal = false;
    let appClone: App = Cloner.cloneObject<App>(this.app);
    appClone.approved = true;
    this.appsSvc.update(appClone).subscribe(
      (app: App) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: `${this.app.appTitle} was successfully approved`
        });
        this.app.approved = true;
        this.appsSvc.appUpdated(app);
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: `There was a problem while approved ${this.app.appTitle}`
        });
      }
    );
  }

  private showEnableOrDisableModal(enable: boolean): void {
    if (enable) {
      this.enableModal.show = true;
    }
    else {
      this.disableModal.show = true;
    }
  }

  private hideEnableOrDisableModal(enable: boolean): void {
    if (enable) {
      this.enableModal.show = false;
    }
    else {
      this.disableModal.show = false;
    }
  }

  private showEnableOrDisableTrustedModal(enable: boolean): void {
    if (enable) {
      this.enableTrustedModal.show = true;
    }
    else {
      this.disableTrustedModal.show = true;
    }
  }

  private hideEnableOrDisableTrustedModal(enable: boolean): void {
    if (enable) {
      this.enableTrustedModal.show = false;
    }
    else {
      this.disableTrustedModal.show = false;
    }
  }

  private fetchApp(): void {
    this.appsSvc.fetch(this.route.snapshot.params['id']).subscribe(
      (app: App) => {
        this.app = app;
        this.generateCrumbs();
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
        title: "MicroApp Manager",
        active: false,
        link: '/portal/app-manager'
      },
      {
        title: this.app.appTitle + " Details",
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }


}
