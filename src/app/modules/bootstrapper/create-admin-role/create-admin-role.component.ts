import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import {RoleRepresentation} from '../../../models/role-representation.model';
import {RoleConfigFormComponent} from '../../config-forms/role-config-form/role-config-form.component';

@Component({
  selector: 'app-create-admin-role',
  templateUrl: './create-admin-role.component.html',
  styleUrls: ['./create-admin-role.component.scss']
})
export class CreateAdminRoleComponent implements OnInit {

  @Output() configChanged: EventEmitter<RoleRepresentation>;

  @ViewChild(RoleConfigFormComponent) roleForm: RoleConfigFormComponent;

  constructor() { 
    this.configChanged = new EventEmitter<RoleRepresentation>();
  }

  ngOnInit() {
  }

  formCreated(): void {
    let roleDefault: RoleRepresentation = {
      name: "Administrator",
      id: "administrator",
      description: "Administrator role",
      realmRoles: [
        'impersonation',
        'manage-clients',
        'realm-admin',
        'manage-realm',
        'manage-events',
        'view-users',
        'query-groups',
        'view-realm',
        'create-client',
        'manage-identity-providers',
        'manage-authorization',
        'view-events',
        'query-clients',
        'query-users',
        'query-realms',
        'view-authorization',
        'manage-users',
        'view-clients',
        'view-identity-providers'
      ],
      accountRoles: [
        "manage-account-links",
        "manage-account",
        "view-profile"
      ]
    };
    this.roleForm.setForm(roleDefault);
  }

  formSubmitted(role: RoleRepresentation): void {
    this.configChanged.emit(role);
  }

}
