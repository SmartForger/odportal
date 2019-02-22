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

@Component({
  selector: 'app-role-mapper',
  templateUrl: './role-mapper.component.html',
  styleUrls: ['./role-mapper.component.scss']
})
export class RoleMapperComponent implements OnInit {

  rwps: Array<RoleWithPermissions>;
  activeRole: Role;

  @Input() app: App;

  @ViewChild('addModal') private addModal: ModalComponent;
  @ViewChild('removeModal') private removeModal: ModalComponent;

  constructor(
    private rolesSvc: RolesService, 
    private clientsSvc: ClientsService,
    private authSvc: AuthService,
    private appsSvc: AppsService,
    private notifySvc: NotificationService) { 
      this.rwps = new Array<RoleWithPermissions>();
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

}
