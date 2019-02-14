import { Component, OnInit, Input } from '@angular/core';
import {Role} from '../../../models/role.model';
import {ClientsService} from '../../../services/clients.service';

@Component({
  selector: 'app-edit-app-client-roles',
  templateUrl: './edit-app-client-roles.component.html',
  styleUrls: ['./edit-app-client-roles.component.scss']
})
export class EditAppClientRolesComponent implements OnInit {

  roles: Array<Role>;

  @Input() clientId: string;
  @Input() clientName: string;

  constructor(private clientsSvc: ClientsService) { 
    this.roles = new Array<Role>();
  }

  ngOnInit() {
    this.listClientRoles();
  }

  private listClientRoles(): void {
    this.clientsSvc.listRoles(this.clientId).subscribe(
      (roles: Array<Role>) => {
        this.roles = roles;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
