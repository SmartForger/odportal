import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppsService } from '../../../services/apps.service';
import { App } from '../../../models/app.model';
import { ConfirmModalComponent } from '../../display-elements/confirm-modal/confirm-modal.component';
import { NotificationService } from '../../../notifier/notification.service';
import { NotificationType } from '../../../notifier/notificiation.model';
import { ClientsService } from '../../../services/clients.service';
import { Role } from '../../../models/role.model';
import { RolesService } from '../../../services/roles.service';
import {Cloner} from '../../../util/cloner';
import {Filters} from '../../../util/filters';
import {AppWithPermissions} from '../../../models/app-with-permissions.model';
import {AuthService} from '../../../services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PermissionsModalComponent } from '../../display-elements/permissions-modal/permissions-modal.component';

@Component({
  selector: 'app-app-mapper',
  templateUrl: './app-mapper.component.html',
  styleUrls: ['./app-mapper.component.scss']
})
export class AppMapperComponent implements OnInit {

  apps: Array<AppWithPermissions>;
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

  constructor(
    private appsSvc: AppsService,
    private notifySvc: NotificationService,
    private clientsSvc: ClientsService,
    private rolesSvc: RolesService,
    private authSvc: AuthService,
    private dialog: MatDialog) {
    this.apps = new Array<AppWithPermissions>();
    this.showPermissionsModal = false;
    this.canUpdate = true;
  }

  ngOnInit() {
    this.listApps();
  }

  private listApps(): void {
    /*this.appsSvc.listApps().subscribe(
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
    );*/
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

  removeAppFromRole(awp: AppWithPermissions): void {
    this.activeAwp = awp;

    let modalRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {
      
    });

    modalRef.componentInstance.title = 'Remove App from Role';
    modalRef.componentInstance.message = 'Are you sure you want to remove ' + this.activeAwp.app.appTitle + ' from this role?';
    modalRef.componentInstance.icons =  [{icon: 'delete', classList: ''}];
    modalRef.componentInstance.buttons = [{title: 'Remove', classList: 'bg-red'}];

    modalRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Remove'){
        const index: number = this.activeAwp.app.roles.indexOf(this.activeRole.id);
        this.activeAwp.app.roles.splice(index, 1);
        this.appsSvc.update(this.activeAwp.app).subscribe(
          (app: App) => {
            this.activeAwp.app.active = false;
            this.notifySvc.notify({
              type: NotificationType.Success,
              message: this.activeAwp.app.appTitle + " was removed from this role"
            });
            this.appsSvc.appUpdated(app);
            this.activeAwp.permissions.forEach((p: Role) => {
              p.active = false;
            });
            this.updatePermissions(this.activeAwp);
          },
          (err: any) => {
            this.notifySvc.notify({
              type: NotificationType.Error,
              message: "There was a problem while removing " + this.activeAwp.app.appTitle + " from this role"
            });
          }
        );
      }
      modalRef.close();
    });
  }

  addAppToRole(awp: AppWithPermissions): void {
    this.activeAwp = awp;

    let modalRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {
      
    });

    modalRef.componentInstance.title = 'Add App to Role';
    modalRef.componentInstance.message = 'Are you sure you want to add ' + this.activeAwp.app.appTitle + ' to this role?';
    modalRef.componentInstance.icons =  [{icon: 'done', classList: ''}];
    modalRef.componentInstance.buttons = [{title: 'Add', classList: 'bg-green'}];

    modalRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Add App to Role'){
        this.activeAwp.app.roles.push(this.activeRole.id);
        this.appsSvc.update(this.activeAwp.app).subscribe(
          (app: App) => {
            this.activeAwp.app.active = true;
            this.notifySvc.notify({
              type: NotificationType.Success,
              message: this.activeAwp.app.appTitle + " was added to this role"
            });
            this.appsSvc.appUpdated(app);
            this.updatePermissions(this.activeAwp);
          },
          (err: any) => {
            this.notifySvc.notify({
              type: NotificationType.Error,
              message: "There was a problem while adding " + this.activeAwp.app.appTitle + " to this role"
            });
          }
        );
      }
      modalRef.close();
    });
  }

  updatePermissions(awp: AppWithPermissions): void {
    this.activeAwp = Cloner.cloneObject<AppWithPermissions>(awp);

    let modelRef = this.dialog.open(PermissionsModalComponent, {
      data: {
        xwp: this.activeAwp,
        clientName: this.activeAwp.app.clientName
      }
    });

    modelRef.componentInstance.objectTitle = this.activeAwp.app.appTitle;
    modelRef.componentInstance.clientName = this.activeAwp.app.clientName;
    modelRef.componentInstance.objectWithPermissions = this.activeAwp;

    modelRef.componentInstance.saveChanges.subscribe(saveChanges => {
      if(saveChanges){
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
      else{
        this.activeAwp = Cloner.cloneObject<AppWithPermissions>(awp);
      }
      modelRef.close();
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