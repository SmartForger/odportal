import { Component, OnInit, Input } from '@angular/core';
import {Role} from '../../../models/role.model';
import {RoleWithPermissions} from '../../../models/role-with-permissions.model';
import {ClientsService} from '../../../services/clients.service';
import {RolesService} from '../../../services/roles.service';
import {Cloner} from '../../../util/cloner';

@Component({
  selector: 'app-edit-app-role-mappings',
  templateUrl: './edit-app-role-mappings.component.html',
  styleUrls: ['./edit-app-role-mappings.component.scss']
})
export class EditAppRoleMappingsComponent implements OnInit {

  rwps: Array<RoleWithPermissions>;

  @Input() clientId: string;
  @Input() clientName: string;

  constructor(
    private clientsSvc: ClientsService,
    private rolesSvc: RolesService) { 
      this.rwps = new Array<RoleWithPermissions>();
    }

  ngOnInit() {
    this.listRealmRoles();
  }

  private listRealmRoles(): void {
    this.rolesSvc.list().subscribe(
      (roles: Array<Role>) => {
        this.listClientRoles(roles);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private listClientRoles(realmRoles: Array<Role>): void {
    this.clientsSvc.listRoles(this.clientId).subscribe(
      (clientRoles: Array<Role>) => {
        this.iterateClientComposites(realmRoles, clientRoles);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private iterateClientComposites(realmRoles: Array<Role>, clientRoles: Array<Role>): void {
    realmRoles.forEach((realmRole: Role) => {
      this.rolesSvc.listClientComposites(realmRole.id, this.clientId).subscribe(
        (composites: Array<Role>) => {
          this.setPermissions(realmRole, clientRoles, composites);
        },
        (err: any) => {
          console.log(err);
        }
      );
    });
  }

  private setPermissions(realmRole: Role, clientRoles: Array<Role>, composites: Array<Role>): void {
    if (composites.length) {
      let permissions: Array<Role> = Cloner.cloneObjectArray<Role>(clientRoles);
      permissions.forEach((p: Role) => {
        const c: Role = composites.find((comp: Role) => comp.id === p.id);
        if (c) {
          p.active = true;
        }
      });
      this.rwps.push({
        role: realmRole,
        permissions: permissions
      });
    }
  }

}
