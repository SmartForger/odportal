import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {UsersService} from '../../../services/users.service';
import {UserProfile} from '../../../models/user-profile.model';
import {Role} from '../../../models/role.model';
import {AjaxProgressService} from '../../../ajax-progress/ajax-progress.service';
import {Filters} from '../../../util/filters';
import {Cloner} from '../../../util/cloner';

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
      this.listComposites();
    }
    else {
      this.roles = new Array<Role>();
    }
  }

  @Output() userUpdated: EventEmitter<UserProfile>;

  constructor(
    private usersSvc: UsersService,
    private ajaxSvc: AjaxProgressService) { 
      this.roles = new Array<Role>();
      this.userUpdated = new EventEmitter<UserProfile>();
    }

  ngOnInit() {
  }

  update(): void {
    let activeRoles: Array<Role> = Cloner.cloneObjectArray<Role>(this.roles.filter((role: Role) => {
      return role.active;
    })).concat(this.allRoles.find((role: Role) => role.id === "approved"));
    let inactiveRoles: Array<Role> = Cloner.cloneObjectArray<Role>(this.roles.filter((role: Role) => {
      return !role.active;
    })).concat(this.allRoles.find((role: Role) => role.id === "pending"));
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
    this.ajaxSvc.show();
    this.usersSvc.addComposites(this.user.id, roles).subscribe(
      (response: any) => {
        console.log(response);
        this.ajaxSvc.hide();
        this.userUpdated.emit(this.user);
      },
      (err: any) => {
        console.log(err);
      }
    );  
  }

  private listAvailableRoles(): void {
    this.ajaxSvc.show();
    this.usersSvc.listAvailableRoles(this.user.id).subscribe(
      (roles: Array<Role>) => {
        this.allRoles = this.allRoles.concat(roles);
        this.roles = Filters.removeByKeyValue("id", ["approved", "pending"], roles);
        this.ajaxSvc.hide();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private listComposites(): void {
    this.usersSvc.listComposites(this.user.id).subscribe(
      (roles: Array<Role>) => {
        this.allRoles = this.allRoles.concat(roles);
      }
    );
  }



}
