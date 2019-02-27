import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {App} from '../../../models/app.model';
import {Role} from '../../../models/role.model';
import {RolesService} from '../../../services/roles.service';
import {ClientsService} from '../../../services/clients.service';
import { RoleWithPermissions } from '../../../models/role-with-permissions.model';
import {ExternalPermission} from '../../../models/external-permission.model';
import {Cloner} from '../../../util/cloner';
import {Filters} from '../../../util/filters';
import {AuthService} from '../../../services/auth.service';
import { ModalComponent } from '../../display-elements/modal/modal.component';
import {AppsService} from '../../../services/apps.service';
import { NotificationService } from '../../../notifier/notification.service';
import { NotificationType } from '../../../notifier/notificiation.model';

@Component({
  selector: 'app-role-mapper',
  templateUrl: './role-mapper.component.html',
  styleUrls: ['./role-mapper.component.scss']
})
export class RoleMapperComponent implements OnInit {

  rwps: Array<RoleWithPermissions>;
  activeRole: Role;
  activeRwp: RoleWithPermissions;
  showPermissionsModal: boolean;

  private externalPermissions: Array<Role>;

  @Input() app: App;
  @Input() canUpdate: boolean;

  @ViewChild('addModal') private addModal: ModalComponent;
  @ViewChild('removeModal') private removeModal: ModalComponent;

  constructor(
    private rolesSvc: RolesService, 
    private clientsSvc: ClientsService,
    private authSvc: AuthService,
    private appsSvc: AppsService,
    private notifySvc: NotificationService) { 
      this.rwps = new Array<RoleWithPermissions>();
      this.showPermissionsModal = false;
      this.externalPermissions = new Array<Role>();
      this.canUpdate = false;
    }

  ngOnInit() {
    this.listRealmRoles();
    this.listExternalClientRoles();
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

  private listExternalClientRoles(): void {
    this.app.externalPermissions.forEach((ep: ExternalPermission) => {
      this.clientsSvc.listRoles(ep.clientId).subscribe(
        (roles: Array<Role>) => {
          roles = roles.filter((r: Role) => r.name === ep.readPermission);
          this.externalPermissions = this.externalPermissions.concat(roles);
        },
        (err: any) => {
          console.log(err);
        }
      );
    });
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

  toggleRole(role: Role): void {
    this.activeRole = role;
    if (role.active) {
      this.removeModal.show = true;
    }
    else {
      this.addModal.show = true;
    }
  }

  removeButtonClicked(btnName: string): void {
    this.removeModal.show = false;
    const index: number = this.app.roles.indexOf(this.activeRole.id);
    this.app.roles.splice(index, 1);
    this.appsSvc.update(this.app).subscribe(
      (app: App) => {
        this.activeRole.active = false;
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: this.activeRole.name + " was removed from this app"
        });
        this.appsSvc.appUpdated(app);
      },
      (err: any) => {
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while removing " + this.activeRole.name + " from this app"
        });
      }
    );
  }

  addButtonClicked(btnName: string): void {
    this.addModal.show = false;
    this.app.roles.push(this.activeRole.id);
    this.addExternalClientRoles();
    this.appsSvc.update(this.app).subscribe(
      (app: App) => {
        this.activeRole.active = true;
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: this.activeRole.name + " was added to this app"
        });
        this.appsSvc.appUpdated(app);
      },
      (err: any) => {
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while adding " + this.activeRole.name + " to this app"
        });
      }
    );
  }

  private addExternalClientRoles(): void {
    this.rolesSvc.addComposites(this.activeRole.id, this.externalPermissions).subscribe(
      (response: any) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: `External permissions were added successfully to ${this.activeRole.name}`
        });
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: `There was a problem while adding an external permission to ${this.activeRole.name}. Remove this role from the app and try adding it again.`
        });
      }
    );
  }

  showPermissionEditor(rwp: RoleWithPermissions): void {
    this.activeRwp = Cloner.cloneObject<RoleWithPermissions>(rwp);
    this.showPermissionsModal = true;
  }

  updatePermissions(): void {
    this.showPermissionsModal = false;
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