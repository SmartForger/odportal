import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {App} from '../../../models/app.model';
import {Role} from '../../../models/role.model';
import {RolesService} from '../../../services/roles.service';
import {ClientsService} from '../../../services/clients.service';
import { RoleWithPermissions } from '../../../models/role-with-permissions.model';
import {Cloner} from '../../../util/cloner';
import {Filters} from '../../../util/filters';
import {AuthService} from '../../../services/auth.service';
import {AppsService} from '../../../services/apps.service';
import { NotificationService } from '../../../notifier/notification.service';
import { NotificationType } from '../../../notifier/notificiation.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PermissionsModalComponent } from '../../display-elements/permissions-modal/permissions-modal.component';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';

@Component({
  selector: 'app-role-mapper',
  templateUrl: './role-mapper.component.html',
  styleUrls: ['./role-mapper.component.scss']
})
export class RoleMapperComponent implements OnInit {

  rwps: Array<RoleWithPermissions>;
  activeRwp: RoleWithPermissions;
  showPermissionsModal: boolean;
  clientRoles: Array<Role>;

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
        this.rwps = roles.map(role => ({ role }));
        this.listClientRoles();
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

  private listClientRoles(): void {
    this.clientsSvc.listRoles(this.app.clientId).subscribe(
      (roles: Array<Role>) => {
        this.clientRoles = roles;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  toggleRowOpen(rwp: RoleWithPermissions) {
    if (!rwp.expanded) {
      if (rwp.permissions === undefined && !rwp.loading) {
        rwp.loading = true;
        this.listComposite(rwp);
      }
      rwp.expanded = true;
    } else {
      rwp.expanded = false;
    }
  }

  private listComposite(rwp: RoleWithPermissions): void {
    this.rolesSvc.listClientComposites(rwp.role.id, this.app.clientId).subscribe(
      (composites: Array<Role>) => {
        this.setActivePermissions(rwp, this.clientRoles, composites);
      },
      (err: any) => {
        rwp.loading = false;
        console.log(err);
      }
    );
  }

  private setActivePermissions(rwp: RoleWithPermissions, clientRoles: Array<Role>, composites: Array<Role>): void {
    let permissions: Array<Role> = new Array<Role>();
    clientRoles.forEach((role: Role) => {
      let clientRole: Role = Cloner.cloneObject<Role>(role);
      let comp: Role = composites.find((composite: Role) => composite.id === clientRole.id);
      if (comp) {
        clientRole.active = true;
      }
      permissions.push(clientRole);
    });
    rwp.permissions = permissions;
    rwp.loading = false;
  }

  toggleRole(rwp: RoleWithPermissions, ev?: Event): void {
    if (ev) {
      ev.stopPropagation();
    }

    this.activeRwp = rwp;
    if (rwp.role.active) {
      this.removeRole();
    }
    else {
      this.addRole();
    }
  }

  private removeRole(): void{
    let removeRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Remove Role from App",
        subtitle: "Are you sure you want to remove this role?",
        submitButtonTitle: "Remove",
        submitButtonClass: "bg-red",
        formFields: [
          {
            type: 'static',
            label: 'App title',
            defaultValue: this.app.appTitle
          },
          {
            type: 'static',
            label: 'Role name',
            defaultValue: this.activeRwp.role.name
          }
        ]
      }
    });

    removeRef.afterClosed().subscribe(data => {
      if(data) {
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

  private addRole(): void{
    let addRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Add Role to App",
        subtitle: "Are you sure you want to add this role?",
        submitButtonTitle: "Add",
        formFields: [
          {
            type: 'static',
            label: 'App title',
            defaultValue: this.app.appTitle
          },
          {
            type: 'static',
            label: 'Role name',
            defaultValue: this.activeRwp.role.name
          }
        ]
      }
    });

    addRef.afterClosed().subscribe(data => {
      if(data) {
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

  showPermissionEditor(rwp: RoleWithPermissions, ev?: Event): void {
    if (ev) {
      ev.stopPropagation();
    }

    if (rwp.permissions === undefined) {
      this.rolesSvc.listClientComposites(rwp.role.id, this.app.clientId).subscribe(
        (composites: Array<Role>) => {
          this.setActivePermissions(rwp, this.clientRoles, composites);
          this.showPermissionEditorDialog(rwp);
        },
        (err: any) => {
          rwp.loading = false;
          console.log(err);
        }
      );
      return;
    }

    this.showPermissionEditorDialog(rwp);
  }

  private showPermissionEditorDialog(rwp: RoleWithPermissions) {
    this.activeRwp = Cloner.cloneObject<RoleWithPermissions>(rwp);
    let modalRef: MatDialogRef<PermissionsModalComponent> = this.dialog.open(PermissionsModalComponent);

    modalRef.afterOpened().subscribe(() => 
      modalRef.componentInstance.objectWithPermissions = this.activeRwp
    );

    modalRef.componentInstance.objectTitle = rwp.role.name;
    modalRef.componentInstance.clientName = this.app.clientName;

    modalRef.componentInstance.saveChanges.subscribe(saveChanges => {
      if(saveChanges){
        this.updatePermissions();
      }
      modalRef.close();
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
