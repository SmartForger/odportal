import { Component, OnInit, Input } from '@angular/core';
import {RolesService} from '../../../services/roles.service';
import {Role} from '../../../models/role.model';
import {Filters} from '../../../util/filters';
import {AjaxProgressService} from '../../../ajax-progress/ajax-progress.service';
import {Cloner} from '../../../util/cloner';

@Component({
  selector: 'app-realm-role-picker',
  templateUrl: './realm-role-picker.component.html',
  styleUrls: ['./realm-role-picker.component.scss']
})
export class RealmRolePickerComponent implements OnInit {

  roles: Array<Role>;

  @Input() activeRoleId: string;

  constructor(
    private rolesSvc: RolesService,
    private ajaxSvc: AjaxProgressService) { 
      this.roles = new Array<Role>();
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
        console.log(response);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private addComposites(roles: Array<Role>): void {
    this.ajaxSvc.show();
    this.rolesSvc.addComposites(this.activeRoleId, roles).subscribe(
      (response: any) => {
        this.ajaxSvc.hide();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private listRoles(): void {
    this.ajaxSvc.show();
    this.rolesSvc.list().subscribe(
      (roles: Array<Role>) => {
        this.roles = Filters.removeByKeyValue<string, Role>("id", ["pending", "approved", this.activeRoleId], roles);
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
        this.ajaxSvc.hide();
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
