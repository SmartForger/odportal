import { Component, OnInit, Input } from '@angular/core';
import {RolesService} from '../../../services/roles.service';
import {Role} from '../../../models/role.model';
import {Filters} from '../../../util/filters';
import {Cloner} from '../../../util/cloner';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-realm-role-picker',
  templateUrl: './realm-role-picker.component.html',
  styleUrls: ['./realm-role-picker.component.scss']
})
export class RealmRolePickerComponent implements OnInit {

  roles: Array<Role>;

  @Input() activeRoleId: string;

  private _allowSave: boolean
  @Input('allowSave')
  get allowSave(): boolean {
    return this._allowSave;
  }
  set allowSave(allowSave: boolean) {
    this._allowSave = allowSave;
  }

  constructor(
    private rolesSvc: RolesService,
    private notificationSvc: NotificationService,
    private authSvc: AuthService) { 
      this.roles = new Array<Role>();
      this.allowSave = true;
    }

  ngOnInit() {
    this.listRoles();
  }

  update(): void {
    let activeRoles: Array<Role> = Cloner.cloneObjectArray<Role>(this.roles.filter((role: Role) => {
      return role.active;
    }));
    let inactiveRoles: Array<Role> = Cloner.cloneObjectArray<Role>(this.roles.filter((role: Role) => {
      return !role.active;
    })); 
    if (activeRoles) {
      activeRoles = Filters.removeArrayObjectKeys<Role>(["active"], activeRoles);
      this.addComposites(activeRoles);
    }
    if (inactiveRoles) {
      inactiveRoles = Filters.removeArrayObjectKeys<Role>(["active"], inactiveRoles);
      this.deleteComposites(inactiveRoles);
    }
  }

  private deleteComposites(roles: Array<Role>): void {
    this.rolesSvc.deleteComposites(this.activeRoleId, roles).subscribe(
      (response: any) => {
        this.notificationSvc.notify({
          type: NotificationType.Success,
          message: "Realm-level composite roles were removed successfully"
        });
      },
      (err: any) => {
        this.notificationSvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while removing realm-level composite roles"
        });
      }
    );
  }

  private addComposites(roles: Array<Role>): void {
    this.rolesSvc.addComposites(this.activeRoleId, roles).subscribe(
      (response: any) => {
        this.notificationSvc.notify({
          type: NotificationType.Success,
          message: "Realm-level composite roles were added successfully"
        });
      },
      (err: any) => {
        this.notificationSvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while adding realm-level composite roles"
        });
      }
    );
  }

  private listRoles(): void {
    this.rolesSvc.list().subscribe(
      (roles: Array<Role>) => {
        this.roles = Filters.removeByKeyValue<string, Role>("id", [this.authSvc.globalConfig.pendingRoleId, this.authSvc.globalConfig.approvedRoleId, this.activeRoleId], roles);
        this.listComposites();
      },
      (err: any) => {
        console.log(err);
      }
    );  
  }

  private listComposites(): void {
    this.rolesSvc.listRealmComposites(this.activeRoleId).subscribe(
      (roles: Array<Role>) => {
        this.setActiveRoles(roles);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private setActiveRoles(activeRoles: Array<Role>): void {
    activeRoles.forEach((activeRole: Role) => {
      let role: Role = this.roles.find((r: Role) => r.id === activeRole.id);
      if (role) {
        role.active = true;
      }
    });
  }

}
