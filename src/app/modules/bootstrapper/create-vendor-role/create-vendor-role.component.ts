import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {RoleRepresentation} from '../../../models/role-representation.model';

@Component({
  selector: 'app-create-vendor-role',
  templateUrl: './create-vendor-role.component.html',
  styleUrls: ['./create-vendor-role.component.scss']
})
export class CreateVendorRoleComponent implements OnInit {

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
