import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import {App} from '../../../models/app.model';
import {AppsService} from '../../../services/apps.service';
import {ActivatedRoute} from '@angular/router';
import {NotificationType} from '../../../notifier/notificiation.model';
import {NotificationService} from '../../../notifier/notification.service';
import {ConfirmModalComponent} from '../../display-elements/confirm-modal/confirm-modal.component';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {AuthService} from '../../../services/auth.service';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {Subscription, from} from 'rxjs';
import {Cloner} from '../../../util/cloner';
import {Router} from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

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

  constructor(
    private appsSvc: AppsService, 
    private route: ActivatedRoute,
    private notifySvc: NotificationService,
    private crumbsSvc: BreadcrumbsService,
    private authSvc: AuthService,
    private router: Router,
    private dialog: MatDialog) { 
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
    this.sessionUpdatedSub = this.authSvc.observeUserSessionUpdates().subscribe(
      (userId: string) => {
        if (userId === this.authSvc.getUserId()) {
          this.setPermissions();
        }
      }
    );
  }

  enableButtonClicked(): void {
    let enableRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {

    });

    enableRef.componentInstance.title = 'Enable App';
    enableRef.componentInstance.message = 'Are you sure you want to enable this Microapp and permit user access?';
    enableRef.componentInstance.icons = [{icon: 'done_outline', classList: ''}];
    enableRef.componentInstance.buttons = [{title: 'Confirm', classList: 'btn btn-add'}];

    enableRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Confirm'){
        this.enableDisableApp(true);
      }
      enableRef.close();
    });
  }

  disableButtonClicked(): void {
    let disableRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {
      
    });

    disableRef.componentInstance.title = 'Disable App';
    disableRef.componentInstance.message = 'Are you sure you want to disable this Microapp and deny user access?';
    disableRef.componentInstance.icons =  [{icon: 'lock', classList: ''}];
    disableRef.componentInstance.buttons = [{title: 'Confirm', classList: 'btn btn-add'}];

    disableRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Confirm'){
        this.enableDisableApp(false);
      }
      disableRef.close();
    });
  }

  enableDisableApp(enable: boolean): void {
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

  enableTrusted(): void{
    let modalRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {

    });

    modalRef.componentInstance.title = 'Enable Trusted mode';
    modalRef.componentInstance.message = 'Are you sure you want to enable Trusted mode and allow this app to manage core service data?';
    modalRef.componentInstance.icons =  [{icon: '', classList: ''}];
    modalRef.componentInstance.buttons = [{title: 'Confirm', classList: 'btn btn-add btn-success'}];

    modalRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Confirm'){
        this.trustedConfirmed(true);
      }
      modalRef.close();
    });
  }

  disableTrusted(): void{
    let modalRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {

    });

    modalRef.componentInstance.title = 'Disable Trusted mode';
    modalRef.componentInstance.message = 'Are you sure you want to disable Trusted mode and prevent this app from managing core service data?';
    modalRef.componentInstance.icons =  [{icon: '', classList: ''}];
    modalRef.componentInstance.buttons = [{title: 'Confirm', classList: 'btn btn-add btn-success'}];

    modalRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Confirm'){
        this.trustedConfirmed(false);
      }
      modalRef.close();
    });
  }

  trustedConfirmed(enable: boolean): void {
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
    let deleteRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {
      
    });

    deleteRef.componentInstance.title = 'Delete Microapp';
    deleteRef.componentInstance.message = 'Are you sure you want to permanently delete this Microapp?';
    deleteRef.componentInstance.icons =  [{icon: 'delete_forever', classList: ''}];
    deleteRef.componentInstance.buttons = [{title: 'Confirm', classList: 'btn btn-danger'}];

    deleteRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Confirm'){
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
      deleteRef.close();
    });
  }

  approveApp(): void {
    let approveRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {
      
    });

    approveRef.componentInstance.title = 'Approve App';
    approveRef.componentInstance.message = 'Are you sure you want to approve this Microapp and make it available to all users based on the configured role mappings?';
    approveRef.componentInstance.icons =  [{icon: 'done_outline', classList: ''}];
    approveRef.componentInstance.buttons = [{title: 'Confirm', classList: 'btn btn-add'}];

    approveRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Confirm'){
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
      approveRef.close();
    });
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
