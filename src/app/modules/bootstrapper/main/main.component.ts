import { Component, OnInit, ViewChild } from '@angular/core';
import {GlobalConfig} from '../../../models/global-config.model';
import {RoleRepresentation} from '../../../models/role-representation.model';
import {AccountRepresentation} from '../../../models/account-representation.model';
import {FinalizeComponent} from '../finalize/finalize.component';

declare var $: any;

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
    $('#AdminRoleTab').tab('show');
  }

  setAdminRoleConfig(role: RoleRepresentation): void {
    this.finalizeComp.adminRole = role;
    $('#VendorRoleTab').tab('show');
  }

  setUserRoleConfig(role: RoleRepresentation): void {
    this.finalizeComp.userRole = role;
    $('#AdminAccountTab').tab('show');
  }

  setVendorRoleConfig(role: RoleRepresentation): void {
    this.finalizeComp.vendorRole = role;
    $('#UserRoleTab').tab('show');
  }

  setAdminAccountConfig(account: AccountRepresentation): void {
    this.finalizeComp.adminAccount = account;
    $('#CoreServicesTab').tab('show');
  }

  setCoreServicesConfig(config: GlobalConfig): void {
    this.finalizeComp.coreServicesConfig = config;
    $('#FinalizeTab').tab('show');
  }


}
