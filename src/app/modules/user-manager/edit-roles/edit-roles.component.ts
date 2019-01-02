import { Component, OnInit, Input } from '@angular/core';
import {Role} from '../../../models/role.model';
import {RolesService} from '../../../services/roles.service';
import {UsersService} from '../../../services/users.service';
import {Filters} from '../../../util/filters';
import {Cloner} from '../../../util/cloner';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';

@Component({
  selector: 'app-edit-roles',
  templateUrl: './edit-roles.component.html',
  styleUrls: ['./edit-roles.component.scss']
})
export class EditRolesComponent implements OnInit {

  roles: Array<Role>;
  effectiveRoles: Array<Role>;

  @Input() activeUserId: string;

  constructor(
    private rolesSvc: RolesService,
    private usersSvc: UsersService,
    private notificationSvc: NotificationService) { 
      this.roles = new Array<Role>();
      this.effectiveRoles = new Array<Role>();
    }

  ngOnInit() {
    this.listAllRoles();
  }

  update(): void {
    let activeRoles: Array<Role> = Cloner.cloneObjectArray<Role>(this.roles.filter((role) => {
      return role.active;
    }));
    let inactiveRoles: Array<Role> = Cloner.cloneObjectArray<Role>(this.roles.filter((role: Role) => {
      return !role.active;
    }));
    activeRoles = Filters.removeArrayObjectKeys<Role>(["active"], activeRoles);
    inactiveRoles = Filters.removeArrayObjectKeys<Role>(["active"], inactiveRoles);
    this.updateComposites(activeRoles, inactiveRoles);
  }

  private updateComposites(activeRoles: Array<Role>, inactiveRoles: Array<Role>): void {
    this.usersSvc.addComposites(this.activeUserId, activeRoles).subscribe(
      (response: any) => {
        this.deleteComposites(inactiveRoles);
        this.notificationSvc.notify({
          type: NotificationType.Success,
          message: "Roles were added successfully"
        });
      },
      (err: any) => {
        this.notificationSvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while add roles"
        });
      }
    );
  }

  private deleteComposites(roles: Array<Role>): void {
    this.usersSvc.deleteComposites(this.activeUserId, roles).subscribe(
      (response: any) => {
        this.listComposites();
        this.notificationSvc.notify({
          type: NotificationType.Success,
          message: "Roles were deleted successfully"
        });
      },
      (err: any) => {
        this.notificationSvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while removing roles"
        });
      }
    );
  }

  private listAllRoles(): void {
    this.rolesSvc.list().subscribe(
      (roles: Array<Role>) => {
        this.roles = Filters.removeByKeyValue<string, Role>("id", ["approved", "pending"], roles);
        this.listComposites();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private listComposites(): void {
    this.usersSvc.listComposites(this.activeUserId).subscribe(
      (roles: Array<Role>) => {
        this.effectiveRoles = roles;
        this.setActiveRoles();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private setActiveRoles(): void {
    this.roles.map((role: Role) => {
      let effective: Role = this.effectiveRoles.find((r: Role) => role.id === r.id);
      if (effective) {
        role.active = true;
      }
      else {
        role.active = false;
      }
    });
  }

}
