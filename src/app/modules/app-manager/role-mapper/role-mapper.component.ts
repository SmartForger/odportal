import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {App} from '../../../models/app.model';
import {Role} from '../../../models/role.model';
import {RolesService} from '../../../services/roles.service';
import {ClientsService} from '../../../services/clients.service';
import { RoleWithPermissions } from '../../../models/role-with-permissions.model';
import {Cloner} from '../../../util/cloner';
import {Filters} from '../../../util/filters';
import {AuthService} from '../../../services/auth.service';
import { ModalComponent } from '../../display-elements/modal/modal.component';
import {AppsService} from '../../../services/apps.service';
import { NotificationService } from '../../../notifier/notification.service';
import { NotificationType } from '../../../notifier/notificiation.model';
import { MatDialog } from '@angular/material';
import { PermissionsModalComponent } from '../../display-elements/permissions-modal/permissions-modal.component';

@Component({
  selector: 'app-role-mapper',
  templateUrl: './role-mapper.component.html',
  styleUrls: ['./role-mapper.component.scss']
})
export class RoleMapperComponent implements OnInit {

  rwps: Array<RoleWithPermissions>;
  activeRwp: RoleWithPermissions;
  showPermissionsModal: boolean;

  private externalPermissions: Array<Role>;

  @Input() app: App;
  @Input() canUpdate: boolean;

  constructor(
    private rolesSvc: RolesService, 
    private clientsSvc: ClientsService,
    private authSvc: AuthService,
    private appsSvc: AppsService,
    private notifySvc: NotificationService,
    private dialog: MatDialog) { 
      this.rwps = new Array<RoleWithPermissions>();
      this.showPermissionsModal = false;
      this.externalPermissions = new Array<Role>();
      this.canUpdate = false;
    }

  ngOnInit() {
    this.listRealmRoles();
  }

  private listRealmRoles(): void {
    this.rolesSvc.list().subscribe(
      (roles: Array<Role>) => {
        roles = Filters.removeByKeyValue<string, Role>("id", [this.authSvc.globalConfig.pendingRoleId, this.authSvc.globalConfig.approvedRoleId], roles);
        roles = this.setAssignedRoles(roles);
        this.listClientRoles(roles);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private setAssignedRoles(roles: Array<Role>): Array<Role> {
    roles.forEach((role: Role) => {
      if (this.app.roles.includes(role.id)) {
        role.active = true;
      }
    }); 
    return roles;
  }

  private listClientRoles(realmRoles: Array<Role>): void {
    this.clientsSvc.listRoles(this.app.clientId).subscribe(
      (roles: Array<Role>) => {
        this.listComposites(realmRoles, roles);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private listComposites(realmRoles: Array<Role>, clientRoles: Array<Role>): void {
    realmRoles.forEach((role: Role) => {
      this.rolesSvc.listClientComposites(role.id, this.app.clientId).subscribe(
        (composites: Array<Role>) => {
          this.setActivePermissions(role, clientRoles, composites);
        },
        (err: any) => {
          console.log(err);
        }
      );
    });
  }

  private setActivePermissions(realmRole: Role, clientRoles: Array<Role>, composites: Array<Role>): void {
    let permissions: Array<Role> = new Array<Role>();
    clientRoles.forEach((role: Role) => {
      let clientRole: Role = Cloner.cloneObject<Role>(role);
      let comp: Role = composites.find((composite: Role) => composite.id === clientRole.id);
      if (comp) {
        clientRole.active = true;
      }
      permissions.push(clientRole);
    });
    this.rwps.push({
      role: realmRole,
      permissions: permissions
    });
  }

  toggleRole(rwp: RoleWithPermissions): void {
    this.activeRwp = rwp;
    if (rwp.role.active) {
      this.removeModal();
    }
    else {
      this.addModal();
    }
  }

  private removeModal(): void{
    let removeRef = this.dialog.open(ModalComponent, {
      data: {
        title: 'Remove Role from App',
        message: 'Are you sure you want to remove ' + this.activeRwp.role.name + ' from this app?',
        icons: [{icon: 'clear', classList: ''}],
        buttons: [{title: 'Remove Role from App', classList: 'btn btn-warning'}]
      }
    });

    removeRef.afterClosed().subscribe(result => {
      if(result === 'Remove Role from App'){
        const index: number = this.app.roles.indexOf(this.activeRwp.role.id);
        this.app.roles.splice(index, 1);
        this.appsSvc.update(this.app).subscribe(
          (app: App) => {
            this.activeRwp.role.active = false;
            this.notifySvc.notify({
              type: NotificationType.Success,
              message: this.activeRwp.role.name + " was removed from this app"
            });
            this.appsSvc.appUpdated(app);
            this.activeRwp.permissions.forEach((p: Role) => {
              p.active = false;
            });
            this.updatePermissions();
          },
          (err: any) => {
            this.notifySvc.notify({
              type: NotificationType.Error,
              message: "There was a problem while removing " + this.activeRwp.role.name + " from this app"
            });
          }
        );
      }
    });
  }

  private addModal(): void{
    let addRef = this.dialog.open(ModalComponent, {
      data: {
        title: 'Add Role to App',
        message: 'Are you sure you want to add ' + this.activeRwp.role.name + ' to this app? This will automatically add any external permissions to ' + this.activeRwp.role.name + '.',
        icons: [{icon: 'done_outline', classList: ''}],
        buttons: [{title: 'Add Role to App', classList: 'btn btn-success'}]
      }
    });

    addRef.afterClosed().subscribe(result => {
      if(result === 'Add Role to App'){
        this.app.roles.push(this.activeRwp.role.id);
        this.addExternalClientRoles();
        this.appsSvc.update(this.app).subscribe(
          (app: App) => {
            this.activeRwp.role.active = true;
            this.notifySvc.notify({
              type: NotificationType.Success,
              message: this.activeRwp.role.name + " was added to this app"
            });
            this.appsSvc.appUpdated(app);
            this.showPermissionEditor(this.activeRwp);
          },
          (err: any) => {
            this.notifySvc.notify({
              type: NotificationType.Error,
              message: "There was a problem while adding " + this.activeRwp.role.name + " to this app"
            });
          }
        );
      }
    });
  }

  private addExternalClientRoles(): void {
    this.rolesSvc.addComposites(this.activeRwp.role.id, this.externalPermissions).subscribe(
      (response: any) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: `External permissions were added successfully to ${this.activeRwp.role.name}`
        });
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: `There was a problem while adding an external permission to ${this.activeRwp.role.name}. Remove this role from the app and try adding it again.`
        });
      }
    );
  }

  showPermissionEditor(rwp: RoleWithPermissions): void {
    this.activeRwp = Cloner.cloneObject<RoleWithPermissions>(rwp);

    let permRef = this.dialog.open(PermissionsModalComponent, {
      data: {
        clientName: this.app.clientName,
        rwp: this.activeRwp,
      }
    });

    permRef.afterClosed().subscribe(result => {
      if(result === 'Confirm'){
        this.updatePermissions();
      }
      else{
        this.activeRwp = Cloner.cloneObject<RoleWithPermissions>(rwp);
      }
    });
  }

  updatePermissions(): void {
    let rolesToAdd: Array<Role> = Filters.removeArrayObjectKeys<Role>(
      ["active"],
      Cloner.cloneObjectArray<Role>(this.activeRwp.permissions.filter((r: Role) => r.active))
    );
    const rolesToDelete: Array<Role> = Filters.removeArrayObjectKeys<Role>(
      ["active"],
      Cloner.cloneObjectArray<Role>(this.activeRwp.permissions.filter((r: Role) => !r.active))
    );
    this.addComposites(Cloner.cloneObjectArray<Role>(rolesToAdd), rolesToDelete);
    rolesToAdd.forEach((role: Role) => role.active = true);
    let rwp: RoleWithPermissions = this.rwps.find((item: RoleWithPermissions) => item.role.id === this.activeRwp.role.id);
    rwp.permissions = rolesToAdd.concat(rolesToDelete);
  }

  private addComposites(roles: Array<Role>, inactiveRoles: Array<Role>): void {
    this.rolesSvc.addComposites(this.activeRwp.role.id, roles).subscribe(
      (response: any) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: "Permissions were added successfully to " + this.activeRwp.role.name
        });
        this.deleteComposites(inactiveRoles);
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while adding permissions to " + this.activeRwp.role.name
        });
      }
    );
  }

  private deleteComposites(roles: Array<Role>): void {
    this.rolesSvc.deleteComposites(this.activeRwp.role.id, roles).subscribe(
      (response: any) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: "Permissions were successfully removed from " + this.activeRwp.role.name
        });
        this.authSvc.updateUserSession(true);
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while removing permissions from " + this.activeRwp.role.name
        });
      }
    );
  }

}
