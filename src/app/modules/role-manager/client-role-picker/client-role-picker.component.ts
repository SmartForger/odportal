import { Component, OnInit, Input } from '@angular/core';
import {ClientsService} from '../../../services/clients.service';
import {RolesService} from '../../../services/roles.service';
import {Client} from '../../../models/client.model';
import {Role} from '../../../models/role.model';
import {Filters} from '../../../util/filters';
import {AjaxProgressService} from '../../../ajax-progress/ajax-progress.service';

@Component({
  selector: 'app-client-role-picker',
  templateUrl: './client-role-picker.component.html',
  styleUrls: ['./client-role-picker.component.scss']
})
export class ClientRolePickerComponent implements OnInit {

  clients: Array<Client>;
  roles: Array<Role>;

  @Input() activeRoleId: string;

  constructor(
    private clientsSvc: ClientsService, 
    private rolesSvc: RolesService,
    private ajaxSvc: AjaxProgressService) { 
    this.clients = new Array<Client>({
      clientId: "Choose a Client",
      id: null,
      name: null
    });
    this.roles = new Array<Role>();
  }

  ngOnInit() {
    this.listClients();
  }

  clientChanged($event: any): void {
    if ($event.target.value !== "null") {
      this.ajaxSvc.show();
      this.clientsSvc.listRoles($event.target.value).subscribe(
        (roles: Array<Role>) => {
          this.roles = roles;
          if (this.activeRoleId) {
            this.listComposites($event.target.value);
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
    else {
      this.roles = new Array<Role>();
    }
  }

  update(): void {
    let activeRoles: Array<Role> = this.roles.filter((role: Role) => {
      return role.active;
    });
    let inactiveRoles: Array<Role> = this.roles.filter((role: Role) => {
      return !role.active;
    }); 
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

  private listClients(): void {
    this.ajaxSvc.show();
    this.clientsSvc.list().subscribe(
      (clients: Array<Client>) => {
        this.ajaxSvc.hide();
        this.clients = this.clients.concat(clients);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private listComposites(clientId: string): void {
    this.rolesSvc.listComposites(this.activeRoleId, clientId).subscribe(
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
