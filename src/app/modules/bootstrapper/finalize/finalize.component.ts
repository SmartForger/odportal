import { Component, OnInit } from '@angular/core';
import {GlobalConfig} from '../../../models/global-config.model';
import {RoleRepresentation} from '../../../models/role-representation.model';
import {AccountRepresentation} from '../../../models/account-representation.model';
import {Formatters} from '../../../util/formatters';

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
  coreServicesConfig: GlobalConfig;

  private _adminAccount: AccountRepresentation;
  get adminAccount(): AccountRepresentation {
    return this._adminAccount;
  }
  set adminAccount(account: AccountRepresentation) {
    this._adminAccount = account;
    if (account) {
      this.hiddenPassword = Formatters.createHiddenPassword(account.password);
    }
    this.showPassword = false;
  }

  showPassword: boolean;
  hiddenPassword: string;

  constructor() { 
    this.ssoConfig = null;
    this.adminRole = null;
    this.userRole = null;
    this.adminAccount = null;
    this.showPassword = true;
    this.hiddenPassword = null;
  }

  ngOnInit() {
  }

}
