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
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-edit-app',
  templateUrl: './edit-app.component.html',
  styleUrls: ['./edit-app.component.scss']
})
export class EditAppComponent implements OnInit, OnDestroy {

  app: App;
  canUpdate: boolean;
  canDelete: boolean;
  private broker: AppPermissionsBroker;
  private sessionUpdatedSub: Subscription;

  @ViewChild('enableModal') private enableModal: ModalComponent;
  @ViewChild('disableModal') private disableModal: ModalComponent;
  @ViewChild('approveModal') private approvalModal: ModalComponent;
  @ViewChild('deleteModal') private deleteModal: ModalComponent;

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

  enableButtonClicked(): void {
    let enableRef = this.dialog.open(ModalComponent, {
      data: {
        title: 'Enable App',
        message: 'Are you sure you want to enable this Microapp and permit user access?',
        icons: [{icon: 'done_outline', classList: ''}],
        buttons: [{title: 'Confirm', classList: 'btn btn-add'}]
      }
    });

    enableRef.afterClosed().subscribe(result => {
      if(result === 'Confirm'){
        this.enableDisableApp(true);
      }
    });
  }

  disableButtonClicked(): void {
    let disableRef = this.dialog.open(ModalComponent, {
      data: {
        title: 'Disable App',
        message: 'Are you sure you want to disable this Microapp and deny user access?',
        icons: [{icon: 'lock', classList: ''}],
        buttons: [{title: 'Confirm', classList: 'btn btn-add'}]
      }
    });

    disableRef.afterClosed().subscribe(result => {
      if(result === 'Confirm'){
        this.enableDisableApp(false);
      }
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

  removeApp(): void {
    let deleteRef = this.dialog.open(ModalComponent, {
      data: {
        title: 'Delete Microapp',
        message: 'Are you sure you want to permanently delete this Microapp?',
        icons: [{icon: 'delete_forever', classList: ''}],
        buttons: [{title: 'Confirm', classList: 'btn btn-danger'}]
      }
    });
    deleteRef.afterClosed().subscribe(result => {
      if(result === 'Confirm'){
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
    });
  }

  approveApp(): void {
    let approveRef = this.dialog.open(ModalComponent, {
      data: {
        title: 'Approve App',
        message: 'Are you sure you want to approve this Microapp and make it available to all users based on the configured role mappings?',
        icons: [{icon: 'done_outline', classList: ''}],
        buttons: [{title: 'Confirm', classList: 'btn btn-add'}]
      }
    });

    approveRef.afterClosed().subscribe(result => {
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
