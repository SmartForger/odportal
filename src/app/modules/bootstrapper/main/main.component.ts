import { Component, OnInit, ViewChild } from '@angular/core';
import {GlobalConfig} from '../../../models/global-config.model';
import {RoleRepresentation} from '../../../models/role-representation.model';
import {AccountRepresentation} from '../../../models/account-representation.model';
import {FinalizeComponent} from '../finalize/finalize.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @ViewChild(FinalizeComponent) finalizeComp: FinalizeComponent;

  constructor() { 
  }

  ngOnInit() {
  }

  setSSOConfig(config: GlobalConfig): void {
    this.finalizeComp.ssoConfig = config;
  }

  setAdminRoleConfig(role: RoleRepresentation): void {
    this.finalizeComp.adminRole = role;
  }

  setUserRoleConfig(role: RoleRepresentation): void {
    this.finalizeComp.userRole = role;
  }

  setVendorRoleConfig(role: RoleRepresentation): void {
    this.finalizeComp.vendorRole = role;
  }

  setAdminAccountConfig(account: AccountRepresentation): void {
    this.finalizeComp.adminAccount = account;
  }

  setCoreServicesConfig(config: GlobalConfig): void {
    this.finalizeComp.coreServicesConfig = config;
  }


}
