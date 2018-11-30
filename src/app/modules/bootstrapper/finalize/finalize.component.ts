import { Component, OnInit, ViewChild } from '@angular/core';
import {GlobalConfig} from '../../../models/global-config.model';
import {RoleRepresentation} from '../../../models/role-representation.model';
import {AccountRepresentation} from '../../../models/account-representation.model';
import {Formatters} from '../../../util/formatters';
import {InstallerComponent} from '../installer/installer.component';

@Component({
  selector: 'app-finalize',
  templateUrl: './finalize.component.html',
  styleUrls: ['./finalize.component.scss']
})
export class FinalizeComponent implements OnInit {

  private _ssoConfig: GlobalConfig;
  get ssoConfig(): GlobalConfig {
    return this._ssoConfig;
  }
  set ssoConfig(config: GlobalConfig) {
    this._ssoConfig = config;
    this.validateSettings();
  }

  private _adminRole: RoleRepresentation;
  get adminRole(): RoleRepresentation {
    return this._adminRole;
  }
  set adminRole(role: RoleRepresentation) {
    this._adminRole = role;
    this.validateSettings();
  }

  private _userRole: RoleRepresentation;
  get userRole(): RoleRepresentation {
    return this._userRole;
  }
  set userRole(role: RoleRepresentation) {
    this._userRole = role;
    this.validateSettings();
  }

  private _vendorRole: RoleRepresentation;
  get vendorRole(): RoleRepresentation {
    return this._vendorRole;
  }
  set vendorRole(role: RoleRepresentation) {
    this._vendorRole = role;
    this.validateSettings();
  }

  private _coreServicesConfig: GlobalConfig;
  get coreServicesConfig(): GlobalConfig {
    return this._coreServicesConfig;
  }
  set coreServicesConfig(config: GlobalConfig) {
    this._coreServicesConfig = config;
    this.validateSettings();
  }

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
  installerRunning: boolean;
  showInstaller: boolean;
  settingsAreValid: boolean;
  showSuccessModal: boolean;

  @ViewChild(InstallerComponent) installer: InstallerComponent;

  constructor() { 
    this.ssoConfig = null;
    this.adminRole = null;
    this.userRole = null;
    this.vendorRole = null;
    this.adminAccount = null;
    this.coreServicesConfig = null;
    this.showPassword = true;
    this.hiddenPassword = null;
    this.installerRunning = false;
    this.showInstaller = false;
    this.settingsAreValid = false;
    this.showSuccessModal = false;
  }

  ngOnInit() {
  }

  startInstallation(): void {
    this.installer.setConfig(this.ssoConfig, this.adminRole, this.userRole, this.vendorRole, this.coreServicesConfig, this.adminAccount);
    this.showInstaller = true;
  }

  setInstallerStatus(isRunning: boolean): void {
    this.installerRunning = isRunning;
  }

  installationComplete(): void {
    this.showInstaller = false;
    this.showSuccessModal = true;
  }

  exitBootstrapper(): void {
    this.showSuccessModal = false;
    window.location.href = "/";
  }

  private validateSettings(): void {
    if (this.ssoConfig && this.adminRole && this.userRole && this.vendorRole && this.coreServicesConfig) {
      this.settingsAreValid = true;
    }
    else {
      this.settingsAreValid = false;
    }
  }

}
