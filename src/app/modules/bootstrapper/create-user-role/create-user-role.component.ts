import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import {RoleRepresentation} from '../../../models/role-representation.model';
import {RoleConfigFormComponent} from '../../config-forms/role-config-form/role-config-form.component';

@Component({
  selector: 'app-create-user-role',
  templateUrl: './create-user-role.component.html',
  styleUrls: ['./create-user-role.component.scss']
})
export class CreateUserRoleComponent implements OnInit {

  @Output() configChanged: EventEmitter<RoleRepresentation>;

  @ViewChild(RoleConfigFormComponent) roleForm: RoleConfigFormComponent;

  constructor() { 
    this.configChanged = new EventEmitter<RoleRepresentation>();
  }

  ngOnInit() {
  }

  formCreated(): void {
    const roleDefault: RoleRepresentation = {
      name: "User",
      id: "user",
      description: "User role",
      realmRoles: [
        "query-users",
        "view-users"
      ],
      accountRoles: [
        "view-profile"
      ]
    };
    this.roleForm.setForm(roleDefault);
  }

  formSubmitted(role: RoleRepresentation): void {
    this.configChanged.emit(role);
  }

}
