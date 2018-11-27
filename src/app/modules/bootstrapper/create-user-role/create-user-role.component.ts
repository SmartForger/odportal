import { Component, OnInit } from '@angular/core';
import {RoleRepresentation} from '../../../models/role-representation.model';

@Component({
  selector: 'app-create-user-role',
  templateUrl: './create-user-role.component.html',
  styleUrls: ['./create-user-role.component.scss']
})
export class CreateUserRoleComponent implements OnInit {

  constructor() { 
  }

  ngOnInit() {
  }

  formSubmitted(role: RoleRepresentation): void {
    console.log(role);
  }

}
