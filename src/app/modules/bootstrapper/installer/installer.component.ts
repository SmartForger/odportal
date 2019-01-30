import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { UpdateConfig } from '../../../models/update-config.model';
import { GlobalConfig } from '../../../models/global-config.model';
import { RoleRepresentation } from '../../../models/role-representation.model';
import { AccountRepresentation } from '../../../models/account-representation.model';
import { ConnectionStatus } from '../../../util/constants';
import { VendorsService } from '../../../services/vendors.service';
import { AppsService } from '../../../services/apps.service';
import { WidgetsService } from '../../../services/widgets.service';
import { ServicesService } from '../../../services/services.service';
import {ConfigService} from '../../../services/config.service';
import { ApiResponse } from '../../../models/api-response.model';
import { TestableService } from '../../../interfaces/testable-service';
import {App} from '../../../models/app.model';
import {AdminCredentials} from '../../../models/admin-credentials.model';
import {SsoAdminCredsFormComponent} from '../../config-forms/sso-admin-creds-form/sso-admin-creds-form.component';
import {ConfigWithClients} from '../../../models/config-with-clients.model';
import {Client} from '../../../models/client.model';

@Component({
  selector: 'app-installer',
  templateUrl: './installer.component.html',
  styleUrls: ['./installer.component.scss']
})

export class InstallerComponent implements OnInit {

  updateConfig: UpdateConfig;
  readonly ConnStatus;
  serviceTests: any;
  showServiceTests: boolean;
  showConfigProgress: boolean;
  configStatus: ConnectionStatus;
  configMessage: string;
  hideAdminForm: boolean;
  createNewConfig: boolean;

  @Output() isRunning: EventEmitter<boolean>;
  @Output() installationComplete: EventEmitter<void>;

  @ViewChild(SsoAdminCredsFormComponent) credsForm: SsoAdminCredsFormComponent;

  constructor(
    private vendorsSvc: VendorsService,
    private appsSvc: AppsService,
    private widgetsSvc: WidgetsService,
    private servicesSvc: ServicesService,
    private configSvc: ConfigService) {
    this.isRunning = new EventEmitter<boolean>();
    this.installationComplete = new EventEmitter<void>();
    this.ConnStatus = ConnectionStatus;
    this.showServiceTests = false;
    this.showConfigProgress = false;
    this.configStatus = ConnectionStatus.Pending;
    this.configMessage = "";
    this.hideAdminForm = false;
    this.createNewConfig = true;
    this.serviceTests = {
      vendors: {
        status: ConnectionStatus.Pending,
        message: "",
        test: () => {
          this.testService(this.vendorsSvc, this.updateConfig.globalConfig.vendorsServiceConnection, this.serviceTests.vendors)
        }
      },
      apps: {
        status: ConnectionStatus.Pending,
        message: "",
        test: () => {
          this.testService(this.appsSvc, this.updateConfig.globalConfig.appsServiceConnection, this.serviceTests.apps)
        }
      },
      widgets: {
        status: ConnectionStatus.Pending,
        message: "",
        test: () => {
          this.testService(this.widgetsSvc, this.updateConfig.globalConfig.widgetsServiceConnection, this.serviceTests.widgets)
        }
      },
      services: {
        status: ConnectionStatus.Pending,
        message: "",
        test: () => {
          this.testService(this.servicesSvc, this.updateConfig.globalConfig.servicesServiceConnection, this.serviceTests.services)
        }
      }
    };
  }

  ngOnInit() {
  }

  setNewConfig(
    ssoConfig: GlobalConfig,
    adminRole: RoleRepresentation,
    userRole: RoleRepresentation,
    vendorRole: RoleRepresentation,
    coreServicesConfig: GlobalConfig,
    adminAccount: AccountRepresentation) {
    this.updateConfig = {
      globalConfig: this.createGlobalConfig(ssoConfig, coreServicesConfig),
      adminRole: adminRole,
      vendorRole: vendorRole,
      userRole: userRole,
      adminAccount: adminAccount
    };
    this.createNewConfig = true;
  }

  setExistingConfig(realmConfig: GlobalConfig, coreServicesConfig: GlobalConfig): void {
    this.updateConfig = {
      globalConfig: this.createGlobalConfig(realmConfig, coreServicesConfig)
    };
    this.updateConfig.globalConfig.pendingRoleId = realmConfig.pendingRoleId;
    this.updateConfig.globalConfig.pendingRoleName = realmConfig.pendingRoleName;
    this.updateConfig.globalConfig.approvedRoleId = realmConfig.approvedRoleId;
    this.updateConfig.globalConfig.approvedRoleName = realmConfig.approvedRoleName;
    this.createNewConfig = false;
  }

  private createGlobalConfig(realmConfig: GlobalConfig, servicesConfig: GlobalConfig): GlobalConfig {
    let globalConfig: GlobalConfig = {
      ssoConnection: realmConfig.ssoConnection,
        realm: realmConfig.realm,
        realmDisplayName: realmConfig.realmDisplayName,
        publicClientName: realmConfig.publicClientName,
        publicClientId: realmConfig.publicClientId,
        bearerClientName: realmConfig.bearerClientName,
        bearerClientId: realmConfig.bearerClientId,
        vendorsServiceConnection: servicesConfig.vendorsServiceConnection,
        appsServiceConnection: servicesConfig.appsServiceConnection,
        widgetsServiceConnection: servicesConfig.widgetsServiceConnection,
        servicesServiceConnection: servicesConfig.servicesServiceConnection
    };
    if (realmConfig.administratorRoleId) {
      globalConfig.administratorRoleId = realmConfig.administratorRoleId;
    }
    return globalConfig;
  }

  submitForm(creds: AdminCredentials): void {
    this.updateConfig.adminCredentials = creds;
    this.showServiceTests = true;
    this.setIsRunningStatus(true);
    this.runServiceTests();
  }

  private runServiceTests(): void {
    for (let key in this.serviceTests) {
      this.serviceTests[key].status = ConnectionStatus.Pending;
      this.serviceTests[key].message = "";
      this.serviceTests[key].test();
    }
  }

  private testService(svc: TestableService, route: string, serviceTest: any): void {
    svc.test(route).subscribe(
      (resp: ApiResponse) => {
        serviceTest.status = ConnectionStatus.Success;
        this.checkTestStatuses();
      },
      (err) => {
        serviceTest.status = ConnectionStatus.Failed;
        if (err.status == 404) {
          serviceTest.message = "Invalid route. Cannot find service."
        }
        else {
          serviceTest.message = err.error.message;
        }
        this.checkTestStatuses();
      }
    );
  }

  private checkTestStatuses(): void {
    let allCompleted: boolean = true;
    let allPassed: boolean = true;
    for (let key in this.serviceTests) {
      if (this.serviceTests[key].status === ConnectionStatus.Pending) {
        allPassed = false;
        allCompleted = false;
      }
      else {
        if (this.serviceTests[key].status !== ConnectionStatus.Success) {
          allPassed = false;
        }
      }
    }
    if (allCompleted) {
      if (allPassed) {
        if (this.createNewConfig) {
          this.setupNewRealm();
        }
        else {
          this.setupExistingRealm();
        }
      }
      else {
        this.setIsRunningStatus(false);
      }
    }
  }

  private installNativeApps(clients: Array<Client>): void {
    this.appsSvc.setup(
      this.updateConfig.globalConfig.appsServiceConnection, 
      this.updateConfig.adminCredentials, 
      this.updateConfig.globalConfig.administratorRoleId,
      clients).subscribe(
      (apps: Array<App>) => {
        this.installationComplete.emit();
      },
      (err: any) => {
        this.setConfigStatus(ConnectionStatus.Failed, err.error.message);
      }
    );
  }

  private setupNewRealm(): void {
    this.setConfigStatus(ConnectionStatus.Pending, "");
    this.configSvc.setupNewRealm(this.updateConfig).subscribe(
      (cwc: ConfigWithClients) => {
        this.updateConfig.globalConfig.administratorRoleId = cwc.adminRoleId;
        this.installNativeApps(cwc.appClients);
      },
      (err: any) => {
        this.setConfigStatus(ConnectionStatus.Failed, err.error.message);
        this.setIsRunningStatus(false);
      }
    );
  }

  private setupExistingRealm(): void {
    this.setConfigStatus(ConnectionStatus.Pending, "");
    this.configSvc.setupExistingRealm(this.updateConfig).subscribe(
      (cwc: ConfigWithClients) => {
        this.installNativeApps(cwc.appClients);
      },
      (err: any) => {
        this.setConfigStatus(ConnectionStatus.Failed, err.error.message);
        this.setIsRunningStatus(false);
      }
    );
  }

  private setConfigStatus(status: ConnectionStatus, message: string, show: boolean = true): void {
    this.configStatus = status;
    this.configMessage = message;
    this.showConfigProgress = show;
  }

  private setIsRunningStatus(isRunning: boolean): void {
    this.isRunning.emit(isRunning);
    this.hideAdminForm = isRunning;
  }

}
