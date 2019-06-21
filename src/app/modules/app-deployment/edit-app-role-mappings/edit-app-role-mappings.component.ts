/**
 * @description Shows what app client roles are mapped to realm-level. Only shows realm-level roles that are assigned to the app.
 * @author Steven M. Redman
 */

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
  clientRoles: Array<Role>;

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
        this.listClientRoles();
        this.rwps = roles.map(role => ({ role }));
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private listClientRoles(): void {
    this.clientsSvc.listRoles(this.clientId).subscribe(
      (clientRoles: Array<Role>) => {
        this.clientRoles = clientRoles;
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
    this.rolesSvc.listClientComposites(rwp.role.id, this.clientId).subscribe(
      (composites: Array<Role>) => {
        this.setPermissions(rwp, this.clientRoles, composites);
      },
      (err: any) => {
        rwp.loading = false;
        console.log(err);
      }
    );
  }

  private setPermissions(rwp: RoleWithPermissions, clientRoles: Array<Role>, composites: Array<Role>): void {
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

}