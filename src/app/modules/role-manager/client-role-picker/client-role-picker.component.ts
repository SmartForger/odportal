import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {ClientsService} from '../../../services/clients.service';
import {RolesService} from '../../../services/roles.service';
import {Client} from '../../../models/client.model';
import {Role} from '../../../models/role.model';

@Component({
  selector: 'app-client-role-picker',
  templateUrl: './client-role-picker.component.html',
  styleUrls: ['./client-role-picker.component.scss']
})
export class ClientRolePickerComponent implements OnInit {

  clients: Array<Client>;
  roles: Array<Role>;

  @Input() activeRoleId: string;
  @Output() activeRolesChanged: EventEmitter<Array<Role>>;

  constructor(private clientsSvc: ClientsService, private rolesSvc: RolesService) { 
    this.clients = new Array<Client>({
      clientId: "Choose a Client",
      id: null,
      name: null
    });
    this.roles = new Array<Role>();
    this.activeRolesChanged = new EventEmitter<Array<Role>>();
  }

  ngOnInit() {
    this.listClients();
  }

  clientChanged($event: any): void {
    if ($event.target.value !== "null") {
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

  activeRoleToggled($event: any): void {
    this.activeRolesChanged.emit(this.roles.filter((role: Role) => {return role.active}));
  }

  private listClients(): void {
    this.clientsSvc.list().subscribe(
      (clients: Array<Client>) => {
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
