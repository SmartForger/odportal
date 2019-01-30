import { Component, OnInit, ViewChild } from '@angular/core';
import {GlobalConfig} from '../../../models/global-config.model';
import {InstallerComponent} from '../installer/installer.component';

@Component({
  selector: 'app-alt-finalize',
  templateUrl: './alt-finalize.component.html',
  styleUrls: ['./alt-finalize.component.scss']
})
export class AltFinalizeComponent implements OnInit {

  private _realmConfig: GlobalConfig;
  get realmConfig(): GlobalConfig {
    return this._realmConfig;
  }
  set realmConfig(config: GlobalConfig) {
    this._realmConfig = config;
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

  settingsAreValid: boolean;
  showSuccessModal: boolean;
  showInstaller: boolean;
  installerRunning: boolean;

  @ViewChild(InstallerComponent) installer: InstallerComponent;

  constructor() { 
    this.realmConfig = null;
    this.settingsAreValid = false;
    this.showSuccessModal = false;
    this.showInstaller = false;
    this.installerRunning = false;
  }

  ngOnInit() {
  }

  startInstallation(): void {
    this.installer.setExistingConfig(this.realmConfig, this.coreServicesConfig);
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
    if (this.realmConfig && this.coreServicesConfig) {
      this.settingsAreValid = true;
    }
    else {
      this.settingsAreValid = false;
    }
  }

}
