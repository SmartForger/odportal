import { Component, OnInit, Input } from '@angular/core';
import {ClientsService} from '../../../services/clients.service';
import {RolesService} from '../../../services/roles.service';
import {Role} from '../../../models/role.model';
import {Filters} from '../../../util/filters';
import {Cloner} from '../../../util/cloner';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {KeyValue} from '../../../models/key-value.model';

@Component({
  selector: 'app-client-role-picker',
  templateUrl: './client-role-picker.component.html',
  styleUrls: ['./client-role-picker.component.scss']
})
export class ClientRolePickerComponent implements OnInit {

  clients: Array<KeyValue>;
  roles: Array<Role>;
  assignedRoles: Array<Role>;
  unassignedRoles: Array<Role>;

  clientId: string;

  @Input() activeRoleId: string;

  private _allowSave: boolean;
  @Input('allowSave')
  get allowSave(): boolean {
    return this._allowSave;
  }
  set allowSave(allowSave: boolean) {
    this._allowSave = allowSave;
  }

  constructor(
    private clientsSvc: ClientsService, 
    private rolesSvc: RolesService,
    private notificationSvc: NotificationService) { 
    this.clients = new Array<KeyValue>({
      value: null,
      display: "Choose a Client"
    });
    this.roles = new Array<Role>();
    this.clientId = null;
    this.allowSave = true;
  }

  ngOnInit() {
    this.listClients();
  }

  clientChanged(clientId: string): void {
    if (clientId != null) {
      this.clientsSvc.listRoles(clientId).subscribe(
        (roles: Array<Role>) => {
          this.roles = roles;
          this.listComposites(clientId);
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

  toggleAssignation(role: Role) {
    role.active = !role.active;
    this.updateRolesList();
  }

  private deleteComposites(roles: Array<Role>): void {
    this.rolesSvc.deleteComposites(this.activeRoleId, roles).subscribe(
      (response: any) => {
        this.notificationSvc.notify({
          type: NotificationType.Success,
          message: "Client-level composite roles were removed successfully"
        });
      },
      (err: any) => {
        this.notificationSvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while removing client-level composite roles"
        });
      }
    );
  }

  private addComposites(roles: Array<Role>): void {
    this.rolesSvc.addComposites(this.activeRoleId, roles).subscribe(
      (response: any) => {
        this.notificationSvc.notify({
          type: NotificationType.Success,
          message: "Client-level composite roles were added successfully"
        });
      },
      (err: any) => {
        this.notificationSvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while adding client-level composite roles"
        });
      }
    );
  }

  private listClients(): void {
    this.clientsSvc.generateKeyValues().subscribe(
      (clients: Array<KeyValue>) => {
        this.clients = this.clients.concat(clients);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private listComposites(clientId: string): void {
    this.rolesSvc.listClientComposites(this.activeRoleId, clientId).subscribe(
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
    this.updateRolesList();
  }

  private updateRolesList() {
    this.assignedRoles = this.roles.filter(role => role.active);
    this.unassignedRoles = this.roles.filter(role => !role.active);
  }

}
