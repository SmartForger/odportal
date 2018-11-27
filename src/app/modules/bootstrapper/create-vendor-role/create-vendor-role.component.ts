import { Component, OnInit } from '@angular/core';
import {RoleRepresentation} from '../../../models/role-representation.model';

@Component({
  selector: 'app-create-vendor-role',
  templateUrl: './create-vendor-role.component.html',
  styleUrls: ['./create-vendor-role.component.scss']
})
export class CreateVendorRoleComponent implements OnInit {

  constructor() { 
  }

  ngOnInit() {
    
  }

  formSubmitted(role: RoleRepresentation): void {
    console.log(role);
  }

}
