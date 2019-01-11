import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';
import {ModalComponent} from '../../display-elements/modal/modal.component';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';

@Component({
  selector: 'app-app-mapper',
  templateUrl: './app-mapper.component.html',
  styleUrls: ['./app-mapper.component.scss']
})
export class AppMapperComponent implements OnInit {

  apps: Array<App>;
  activeApp: App;

  @Input() activeRoleId: string;

  @ViewChild('addModal') private addModal: ModalComponent;
  @ViewChild('removeModal') private removeModal: ModalComponent;

  constructor(private appsSvc: AppsService, private notifySvc: NotificationService) { 
    this.apps = new Array<App>();
  }

  ngOnInit() {
    this.listApps();
  }

  private listApps(): void {
    this.appsSvc.listApps().subscribe(
      (apps: Array<App>) => {
        this.apps = apps;
        this.listRoleApps();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private listRoleApps(): void {
    this.appsSvc.listRoleApps(this.activeRoleId).subscribe(
      (apps: Array<App>) => {
        this.setActiveApps(apps);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private setActiveApps(roleApps: Array<App>): void {
    this.apps.forEach((app: App) => {
      const roleApp: App = roleApps.find((a: App) => a.docId === app.docId);
      if (roleApp) {
        app.active = true;
      }
    });
  }

  toggleApp(app: App): void {
    this.activeApp = app;
    if (app.active) {
      this.removeModal.show = true;
    }
    else {
      this.addModal.show = true;
    }
  }

  removeButtonClicked(btnName: string): void {
    this.removeModal.show = false;
    const index: number = this.activeApp.roles.indexOf(this.activeRoleId);
    this.activeApp.roles.splice(index, 1);
    this.appsSvc.update(this.activeApp).subscribe(
      (app: App) => {
        this.activeApp.active = false;
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: this.activeApp.appTitle + " was removed from this role"
        });
        this.appsSvc.appUpdated(app);
      },
      (err: any) => {
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while removing " + this.activeApp.appTitle + " from this role"
        });
      }
    );
  }

  addButtonClicked(btnName: string): void {
    this.addModal.show = false;
    this.activeApp.roles.push(this.activeRoleId);
    this.appsSvc.update(this.activeApp).subscribe(
      (app: App) => {
        this.activeApp.active = true;
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: this.activeApp.appTitle + " was added to this role"
        });
        this.appsSvc.appUpdated(app);
      },
      (err: any) => {
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while adding " + this.activeApp.appTitle + " to this role"
        });
      }
    );
  }

}
