import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppsService } from '../../../services/apps.service';
import { App } from '../../../models/app.model';
import { ModalComponent } from '../../display-elements/modal/modal.component';
import { NotificationService } from '../../../notifier/notification.service';
import { NotificationType } from '../../../notifier/notificiation.model';
import { ClientsService } from '../../../services/clients.service';
import { Role } from '../../../models/role.model';
import { RolesService } from '../../../services/roles.service';
import {Cloner} from '../../../util/cloner';
import {Filters} from '../../../util/filters';
import {AppWithPermissions} from '../../../models/app-with-permissions.model';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-app-mapper',
  templateUrl: './app-mapper.component.html',
  styleUrls: ['./app-mapper.component.scss']
})
export class AppMapperComponent implements OnInit {

  apps: Array<AppWithPermissions>;
  activeApp: App;
  showPermissionsModal: boolean;
  activeAwp: AppWithPermissions;
  activeAwpMods: Array<AppWithPermissions>;

  @Input() activeRole: Role;

  private _canUpdate: boolean;
  @Input('canUpdate')
  get canUpdate(): boolean {
    return this._canUpdate;
  }
  set canUpdate(canUpdate: boolean) {
    this._canUpdate = canUpdate;
  }

  @ViewChild('addModal') private addModal: ModalComponent;
  @ViewChild('removeModal') private removeModal: ModalComponent;

  constructor(
    private appsSvc: AppsService,
    private notifySvc: NotificationService,
    private clientsSvc: ClientsService,
    private rolesSvc: RolesService,
    private authSvc: AuthService) {
    this.apps = new Array<AppWithPermissions>();
    this.showPermissionsModal = false;
    this.canUpdate = true;
  }

  ngOnInit() {
    this.listApps();
  }

  private listApps(): void {
    this.appsSvc.listApps().subscribe(
      (apps: Array<App>) => {
        this.apps = apps.map((app: App) => {
          return { app: app };
        });
        this.listRoleApps();
        this.getAppClientPermissions();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private listRoleApps(): void {
    this.appsSvc.listRoleApps(this.activeRole.id).subscribe(
      (apps: Array<App>) => {
        this.setActiveApps(apps);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private getAppClientPermissions(): void {
    let clientIds: Set<string> = new Set<string>();
    this.apps.forEach((awp: AppWithPermissions, index: number) => {
      clientIds.add(awp.app.clientId);
    });
    clientIds.forEach((clientId: string) => {
      this.listClientRoles(clientId);
    });
  }

  private listClientRoles(clientId: string): void {
    this.clientsSvc.listRoles(clientId).subscribe(
      (roles: Array<Role>) => {
        const appsToSet: Array<AppWithPermissions> = this.apps.filter((awp: AppWithPermissions) => awp.app.clientId === clientId);
        appsToSet.forEach((awp: AppWithPermissions) => {
          awp.permissions = roles;
        });
        this.listClientComposites(clientId, appsToSet);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private listClientComposites(clientId: string, appsToSet: Array<AppWithPermissions>): void {
    this.rolesSvc.listClientComposites(this.activeRole.id, clientId).subscribe(
      (composites: Array<Role>) => {
        this.setActiveComposites(composites, appsToSet);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private setActiveComposites(composites: Array<Role>, appsToSet: Array<AppWithPermissions>): void {
    appsToSet.forEach((awp: AppWithPermissions) => {
      awp.permissions.forEach((role: Role) => {
        const composite: Role = composites.find((c: Role) => c.id === role.id);
        if (composite) {
          role.active = true;
        }
      });
    });
  }

  private setActiveApps(roleApps: Array<App>): void {
    this.apps.forEach((awp: AppWithPermissions) => {
      const roleApp: App = roleApps.find((a: App) => a.docId === awp.app.docId);
      if (roleApp) {
        awp.app.active = true;
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
    const index: number = this.activeApp.roles.indexOf(this.activeRole.id);
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
    this.activeApp.roles.push(this.activeRole.id);
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

  showPermissionEditor(awp: AppWithPermissions): void {
    this.activeAwp = Cloner.cloneObject<AppWithPermissions>(awp);
    this.showPermissionsModal = true;
  }

  updatePermissions(): void {
    this.showPermissionsModal = false;
    let rolesToAdd: Array<Role> = Filters.removeArrayObjectKeys<Role>(
      ["active"],
      Cloner.cloneObjectArray<Role>(this.activeAwp.permissions.filter((r: Role) => r.active))
    );
    const rolesToDelete: Array<Role> = Filters.removeArrayObjectKeys<Role>(
      ["active"],
      Cloner.cloneObjectArray<Role>(this.activeAwp.permissions.filter((role: Role) => !role.active))
    );
    this.addComposites(Cloner.cloneObjectArray<Role>(rolesToAdd), rolesToDelete);
    rolesToAdd.forEach((role: Role) => role.active = true);
    let awps: Array<AppWithPermissions> = this.apps.filter((awp: AppWithPermissions) => awp.app.clientId === this.activeAwp.app.clientId);
    awps.forEach((awp: AppWithPermissions) => {
      awp.permissions = rolesToAdd.concat(rolesToDelete);
    });
  }

  private addComposites(roles: Array<Role>, inactiveRoles: Array<Role>): void {
    this.rolesSvc.addComposites(this.activeRole.id, roles).subscribe(
      (response: any) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: "Roles were added successfully to " + this.activeRole.name
        });
        this.deleteComposites(inactiveRoles);
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while adding roles to " + this.activeRole.name
        });
      }
    );
  }

  private deleteComposites(roles: Array<Role>): void {
    this.rolesSvc.deleteComposites(this.activeRole.id, roles).subscribe(
      (response: any) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: "Roles were removed successfully from " + this.activeRole.name
        });
        this.authSvc.updateUserSession(true);
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while removing roles from " + this.activeRole.name
        });
      }
    );
  }

}