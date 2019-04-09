/**
 * @description Lists roles for a given client
 * @author Steven M. Redman
 */

import { Component, OnInit, Input } from '@angular/core';
import {Role} from '../../../models/role.model';
import {ClientsService} from '../../../services/clients.service';

@Component({
  selector: 'app-client-roles',
  templateUrl: './client-roles.component.html',
  styleUrls: ['./client-roles.component.scss']
})
export class ClientRolesComponent implements OnInit {

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
