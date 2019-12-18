/**
 * @description Layout component for editing an app with controls for deleting and adjusting app settings.
 * @author Steven M. Redman
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import {App} from '../../../models/app.model';
import {AppsService} from '../../../services/apps.service';
import {ActivatedRoute} from '@angular/router';
import {NotificationType} from '../../../notifier/notificiation.model';
import {NotificationService} from '../../../notifier/notification.service';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {AuthService} from '../../../services/auth.service';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {Subscription} from 'rxjs';
import {Cloner} from '../../../util/cloner';
import {Router} from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import {Widget} from '../../../models/widget.model';
import {DashboardAppReplacementInfo} from '../../../models/dashboard-app-replacement-info.model';
import {DashboardService} from '../../../services/dashboard.service';
import {RoleMappingModalComponent} from '../role-mapping-modal/role-mapping-modal.component';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';

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
  attributes: CustomAttributeInfo[] = [];
  selectedTab: number = 0;

  constructor(
    private appsSvc: AppsService, 
    private route: ActivatedRoute,
    private notifySvc: NotificationService,
    private crumbsSvc: BreadcrumbsService,
    private authSvc: AuthService,
    private router: Router,
    private dashboardSvc: DashboardService,
    private dialog: MatDialog) {
      this.canUpdate = false;
      this.canDelete = false;
      this.broker = new AppPermissionsBroker("micro-app-manager");
  }

  ngOnInit() {
    this.setPermissions();
    this.fetchApp();
    this.subscribeToSessionUpdate();

    const customAttributes = localStorage.getItem('customAttributes-edit') || '[]';
    this.attributes = JSON.parse(customAttributes);
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
    let enableRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Enable App",
        subtitle: "Are you sure you want to enable this Microapp and permit user access?",
        submitButtonTitle: "Enable",
        formFields: [
          {
            type: 'static',
            label: 'App title',
            defaultValue: this.app.appTitle
          },
          {
            type: 'static',
            label: 'App version',
            defaultValue: this.app.version
          }
        ]
      }
    });

    enableRef.afterClosed().subscribe(data => {
      if(data){
        this.enableDisableApp(true);
      }
    });
  }

  disableButtonClicked(): void {
    let disableRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Disable App",
        subtitle: "Are you sure you want to disable this Microapp and deny user access?",
        submitButtonTitle: "Disable",
        submitButtonClass: "bg-red",
        formFields: [
          {
            type: 'static',
            label: 'App title',
            defaultValue: this.app.appTitle
          },
          {
            type: 'static',
            label: 'App version',
            defaultValue: this.app.version
          }
        ]
      }
    });

    disableRef.afterClosed().subscribe(data => {
      if(data){
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
        if (enable) {
          this.updateDashboardAppRefs();
        }
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
    let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Enable Trusted mode",
        subtitle: "Are you sure you want to enable Trusted mode and allow this app to manage core service data?",
        submitButtonTitle: "Confirm",
        formFields: [
          {
            type: 'static',
            label: 'App title',
            defaultValue: this.app.appTitle
          },
          {
            type: 'static',
            label: 'App version',
            defaultValue: this.app.version
          }
        ]
      }
    });

    modalRef.afterClosed().subscribe(data => {
      if(data){
        this.trustedConfirmed(true);
      }
    });
  }

  disableTrusted(): void{
    let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Disable Trusted mode",
        subtitle: "Are you sure you want to disable Trusted mode and prevent this app from managing core service data?",
        submitButtonTitle: "Confirm",
        formFields: [
          {
            type: 'static',
            label: 'App title',
            defaultValue: this.app.appTitle
          },
          {
            type: 'static',
            label: 'App version',
            defaultValue: this.app.version
          }
        ]
      }
    });

    modalRef.afterClosed().subscribe(data => {
      if(data){
        this.trustedConfirmed(false);
      }
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
    let deleteRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Delete Microapp",
        subtitle: "Are you sure you want to permanently delete this Microapp?",
        submitButtonTitle: "Delete",
        submitButtonClass: "bg-red",
        formFields: [
          {
            type: 'static',
            label: 'App title',
            defaultValue: this.app.appTitle
          },
          {
            type: 'static',
            label: 'App version',
            defaultValue: this.app.version
          }
        ]
      }
    });

    deleteRef.afterClosed().subscribe(data => {
      if(data){
        this.appsSvc.delete(this.app.docId).subscribe(
          (app: App) => {
            this.notifySvc.notify({
              type: NotificationType.Success,
              message: `${this.app.appTitle} was deleted successfully`
            });
            this.appsSvc.appUpdated(app);
            this.router.navigateByUrl('/portal/app-manager');
          },
          (err: any) => {
            console.log(err);
            this.notifySvc.notify({
              type: NotificationType.Error,
              message: `There was a problem while deleting ${this.app.appTitle}`
            });
          }
        );
      }
    });
  }

  showRoleMapDialog() {
    const roleMapDialogRef: MatDialogRef<RoleMappingModalComponent> =  this.dialog.open(RoleMappingModalComponent);
    roleMapDialogRef.afterClosed()
      .subscribe(data => {
        if (data.length === 0) {
          return;
        }

        let appClone: App = Cloner.cloneObject<App>(this.app);
        appClone.roles = data;

        this.appsSvc.update(appClone).subscribe(
          (app: App) => {
            this.notifySvc.notify({
              type: NotificationType.Success,
              message: data.length > 1 ? `${data.length} roles was added to this app` : `1 role was added to this app`
            });
            this.appsSvc.appUpdated(app);
          },
          (err: any) => {
            this.notifySvc.notify({
              type: NotificationType.Error,
              message: "There was a problem while adding roles to this app"
            });
          },
          () => {
            this.selectedTab = 3;
          }
        );
      });
  }

  approveApp(): void {
    let approveRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: 'Approve App',
        subtitle: 'Are you sure you want to approve this Microapp and make it available to all users based on the configured role mappings?',
        submitButtonTitle: "Approve",
        formFields: [
          {
            type: 'static',
            label: 'App title',
            defaultValue: this.app.appTitle
          },
          {
            type: 'static',
            label: 'App version',
            defaultValue: this.app.version
          }
        ]
      }
    });

    approveRef.afterClosed().subscribe(data => {
      if (data) {
        let appClone: App = Cloner.cloneObject<App>(this.app);
        appClone.approved = true;
        this.appsSvc.update(appClone).subscribe(
          (app: App) => {
            this.notifySvc.notify({
              type: NotificationType.Success,
              message: `${this.app.appTitle} was successfully approved`
            });
            this.app.approved = true;
            this.updateDashboardAppRefs();
            this.appsSvc.appUpdated(app);

            this.showRoleMapDialog();
          },
          (err: any) => {
            console.log(err);
            this.notifySvc.notify({
              type: NotificationType.Error,
              message: `There was a problem while approving ${this.app.appTitle}`
            });
          }
        );
      }
    });
  }

  saveCustomAttributes(cards: CustomAttributeInfo[]) {
    console.log(cards);
    localStorage.setItem('customAttributes-edit', JSON.stringify(cards));
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

  private updateDashboardAppRefs(): void {
    this.appsSvc.listApps().subscribe(
      (apps: Array<App>) => {
        const clientApps: Array<App> = apps.filter((a: App) => a.clientId === this.app.clientId && a.docId !== this.app.docId);
        const appReplacements: Array<DashboardAppReplacementInfo> = this.generateAppReplacementArray(clientApps);
        const widgetReplacements: Array<DashboardAppReplacementInfo> = this.generateWidgetReplacementArray(clientApps);
        this.dashboardSvc.updateDashboardAppRefs(appReplacements, widgetReplacements).subscribe(
          (response) => {
          },
          (err: any) => {
            console.log(err);
          }
        );
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private generateAppReplacementArray(apps: Array<App>): Array<DashboardAppReplacementInfo> {
    let replacements: Array<DashboardAppReplacementInfo> = new Array<DashboardAppReplacementInfo>();
    apps.forEach((app: App) => {
      replacements.push({
        originalId: app.docId,
        replacementId: this.app.docId
      });
    });
    return replacements;
  }

  private generateWidgetReplacementArray(apps: Array<App>): Array<DashboardAppReplacementInfo> {
    let replacements: Array<DashboardAppReplacementInfo> = new Array<DashboardAppReplacementInfo>();
    let widgets: Array<Widget> = new Array<Widget>();
    apps.forEach((app: App) => {
      widgets = widgets.concat(app.widgets);
    });
    widgets.forEach((widget: Widget) => {
      const replacementWidget: Widget = this.app.widgets.find((w: Widget) => w.customId === widget.customId);
      if (replacementWidget) {
        replacements.push({
          originalId: widget.docId,
          replacementId: replacementWidget.docId
        });
      }
    });
    return replacements;
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
