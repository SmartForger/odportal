import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import {RoleRepresentation} from '../../../models/role-representation.model';
import {RoleConfigFormComponent} from '../../config-forms/role-config-form/role-config-form.component';

@Component({
  selector: 'app-create-vendor-role',
  templateUrl: './create-vendor-role.component.html',
  styleUrls: ['./create-vendor-role.component.scss']
})
export class CreateVendorRoleComponent implements OnInit {

  @Output() configChanged: EventEmitter<RoleRepresentation>;

  @ViewChild(RoleConfigFormComponent) roleForm: RoleConfigFormComponent;

  constructor() { 
    this.configChanged = new EventEmitter<RoleRepresentation>();
  }

  ngOnInit() {
  }

  formCreated(): void {
    let roleDefault: RoleRepresentation = {
      name: "Vendor",
      id: "vendor",
      description: "Vendor role",
      realmRoles: [
        'view-users',
        'query-users'
      ],
      accountRoles: [
        'view-profile'
      ]
    };
    this.roleForm.setForm(roleDefault);
  }

  formSubmitted(role: RoleRepresentation): void {
    this.configChanged.emit(role);
  }

}
