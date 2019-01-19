import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {UsersService} from '../../../services/users.service';
import {UserProfile} from '../../../models/user-profile.model';
import {Role} from '../../../models/role.model';
import {Filters} from '../../../util/filters';
import {Cloner} from '../../../util/cloner';
import {RolesService} from '../../../services/roles.service';
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
  allRoles: Array<Role>;

  private _user: UserProfile;
  @Input('user')
  get user(): UserProfile {
    return this._user;
  }
  set user(user: UserProfile) {
    this._user = user;
    this.allRoles = new Array<Role>();
    if (user) {
      this.listAvailableRoles();
      this.listAllRoles();
    }
    else {
      this.roles = new Array<Role>();
    }
  }

  @Output() userUpdated: EventEmitter<UserProfile>;

  constructor(
    private usersSvc: UsersService,
    private rolesSvc: RolesService,
    private notificationSvc: NotificationService,
    private authSvc: AuthService) { 
      this.roles = new Array<Role>();
      this.userUpdated = new EventEmitter<UserProfile>();
    }

  ngOnInit() {
  }

  update(): void {
    let activeRoles: Array<Role> = Cloner.cloneObjectArray<Role>(this.roles.filter((role: Role) => {
      return role.active;
    })).concat(this.allRoles.find((role: Role) => role.id === this.authSvc.globalConfig.approvedRoleId));
    let inactiveRoles: Array<Role> = Cloner.cloneObjectArray<Role>(this.roles.filter((role: Role) => {
      return !role.active;
    })).concat(this.allRoles.find((role: Role) => role.id === this.authSvc.globalConfig.pendingRoleId));
    activeRoles = Filters.removeArrayObjectKeys<Role>(["active"], activeRoles);
    inactiveRoles = Filters.removeArrayObjectKeys<Role>(["active"], inactiveRoles);
    this.addComposites(activeRoles);
    this.deleteComposites(inactiveRoles);
  }

  private deleteComposites(roles: Array<Role>): void {
    this.usersSvc.deleteComposites(this.user.id, roles).subscribe(
      (response: any) => {
        console.log(response);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private addComposites(roles: Array<Role>): void {
    this.usersSvc.addComposites(this.user.id, roles).subscribe(
      (response: any) => {
        console.log(response);
        this.userUpdated.emit(this.user);
        this.notificationSvc.notify({
          type: NotificationType.Success,
          message: this.user.username + " was approved successfully"
        });
      },
      (err: any) => {
        this.notificationSvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while approving " + this.user.username
        });
      }
    );  
  }

  private listAvailableRoles(): void {
    this.usersSvc.listAvailableRoles(this.user.id).subscribe(
      (roles: Array<Role>) => {
        this.roles = Filters.removeByKeyValue<string, Role>("id", [this.authSvc.globalConfig.approvedRoleId, this.authSvc.globalConfig.pendingRoleId], roles);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private listAllRoles(): void {
    this.rolesSvc.list().subscribe(
      (roles: Array<Role>) => {
        this.allRoles = roles;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }



}
