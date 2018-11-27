import { Component, OnInit } from '@angular/core';
import {RoleRepresentation} from '../../../models/role-representation.model';

@Component({
  selector: 'app-create-admin-role',
  templateUrl: './create-admin-role.component.html',
  styleUrls: ['./create-admin-role.component.scss']
})
export class CreateAdminRoleComponent implements OnInit {


  constructor() { 
  }

  ngOnInit() {
  }

  formSubmitted(role: RoleRepresentation): void {
    console.log(role);
  }

}
