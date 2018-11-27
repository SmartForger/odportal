import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {RoleRepresentation} from '../../../models/role-representation.model';

@Component({
  selector: 'app-create-admin-role',
  templateUrl: './create-admin-role.component.html',
  styleUrls: ['./create-admin-role.component.scss']
})
export class CreateAdminRoleComponent implements OnInit {

  @Output() configChanged: EventEmitter<RoleRepresentation>;

  constructor() { 
    this.configChanged = new EventEmitter<RoleRepresentation>();
  }

  ngOnInit() {
  }

  formSubmitted(role: RoleRepresentation): void {
    this.configChanged.emit(role);
  }

}
