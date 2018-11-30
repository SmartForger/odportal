import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { CustomForm } from '../../../base-classes/custom-form';
import { UpdateConfig } from '../../../models/update-config.model';
import { GlobalConfig } from '../../../models/global-config.model';
import { RoleRepresentation } from '../../../models/role-representation.model';
import { AccountRepresentation } from '../../../models/account-representation.model';
import { ConnectionStatus } from '../../../util/constants';
import { VendorsService } from '../../../services/vendors.service';
import { RolesService } from '../../../services/roles.service';
import { UsersService } from '../../../services/users.service';
import { AppsService } from '../../../services/apps.service';
import { WidgetsService } from '../../../services/widgets.service';
import { ServicesService } from '../../../services/services.service';
import {ConfigService} from '../../../services/config.service';
import { ApiResponse } from '../../../models/api-response.model';
import { TestableService } from '../../../interfaces/testable-service';

@Component({
  selector: 'app-installer',
  templateUrl: './installer.component.html',
  styleUrls: ['./installer.component.scss']
})

export class InstallerComponent extends CustomForm implements OnInit {

  updateConfig: UpdateConfig;
  readonly ConnStatus;
  serviceTests: any;
  showServiceTests: boolean;
  showConfigProgress: boolean;
  configStatus: ConnectionStatus;
  configMessage: string;

  @Output() isRunning: EventEmitter<boolean>;
  @Output() installationComplete: EventEmitter<void>;

  constructor(
    private formBuilder: FormBuilder,
    private vendorsSvc: VendorsService,
    private rolesSvc: RolesService,
    private usersSvc: UsersService,
    private appsSvc: AppsService,
    private widgetsSvc: WidgetsService,
    private servicesSvc: ServicesService,
    private configSvc: ConfigService) {

    super();
    this.isRunning = new EventEmitter<boolean>();
    this.installationComplete = new EventEmitter<void>();
    this.ConnStatus = ConnectionStatus;
    this.showServiceTests = false;
    this.showConfigProgress = false;
    this.configStatus = ConnectionStatus.Pending;
    this.configMessage = "";
    this.serviceTests = {
      vendors: {
        status: ConnectionStatus.Pending,
        message: "",
        test: () => {
          this.testService(this.vendorsSvc, this.updateConfig.globalConfig.vendorsServiceConnection, this.serviceTests.vendors)
        }
      },
      roles: {
        status: ConnectionStatus.Pending,
        message: "",
        test: () => {
          this.testService(this.rolesSvc, this.updateConfig.globalConfig.rolesServiceConnection, this.serviceTests.roles)
        }
      },
      users: {
        status: ConnectionStatus.Pending,
        message: "",
        test: () => {
          this.testService(this.usersSvc, this.updateConfig.globalConfig.usersServiceConnection, this.serviceTests.users)
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
    this.buildForm();
  }

  setConfig(
    ssoConfig: GlobalConfig,
    adminRole: RoleRepresentation,
    userRole: RoleRepresentation,
    vendorRole: RoleRepresentation,
    coreServicesConfig: GlobalConfig,
    adminAccount: AccountRepresentation) {
    this.updateConfig = {
      globalConfig: {
        ssoConnection: ssoConfig.ssoConnection,
        realm: ssoConfig.realm,
        realmDisplayName: ssoConfig.realmDisplayName,
        publicClientName: ssoConfig.publicClientName,
        publicClientId: ssoConfig.publicClientId,
        bearerClientName: ssoConfig.bearerClientName,
        bearerClientId: ssoConfig.bearerClientId,
        vendorsServiceConnection: coreServicesConfig.vendorsServiceConnection,
        rolesServiceConnection: coreServicesConfig.rolesServiceConnection,
        usersServiceConnection: coreServicesConfig.usersServiceConnection,
        appsServiceConnection: coreServicesConfig.appsServiceConnection,
        widgetsServiceConnection: coreServicesConfig.widgetsServiceConnection,
        servicesServiceConnection: coreServicesConfig.servicesServiceConnection
      },
      adminRole: adminRole,
      vendorRole: vendorRole,
      userRole: userRole,
      adminAccount: adminAccount
    };
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  submitForm(): void {
    this.isRunning.emit(true);
    this.updateConfig.adminCredentials = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    };
    this.showServiceTests = true;
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
        this.completeConfiguration();
      }
      else {
        this.isRunning.emit(false);
      }
    }
  }

  private completeConfiguration(): void {
    this.showConfigProgress = true;
    this.configStatus = ConnectionStatus.Pending;
    this.configMessage = "";
    this.configSvc.updateConfig(this.updateConfig).subscribe(
      (globalConfig: GlobalConfig) => {
        this.installationComplete.emit();
      },
      (err) => {
        this.configStatus = ConnectionStatus.Failed;
        this.configMessage = err.error.message;
      }
    );
  }

}
