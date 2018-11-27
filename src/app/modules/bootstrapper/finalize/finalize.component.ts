import { Component, OnInit } from '@angular/core';
import {GlobalConfig} from '../../../models/global-config.model';
import {RoleRepresentation} from '../../../models/role-representation.model';
import {AccountRepresentation} from '../../../models/account-representation.model';

@Component({
  selector: 'app-finalize',
  templateUrl: './finalize.component.html',
  styleUrls: ['./finalize.component.scss']
})
export class FinalizeComponent implements OnInit {

  ssoConfig: GlobalConfig;
  adminRole: RoleRepresentation;
  userRole: RoleRepresentation;
  vendorRole: RoleRepresentation;
  adminAccount: AccountRepresentation;
  coreServicesConfig: GlobalConfig;

  constructor() { 
    this.ssoConfig = null;
    this.adminRole = null;
    this.userRole = null;
    this.adminAccount = null;
  }

  ngOnInit() {
  }

}
