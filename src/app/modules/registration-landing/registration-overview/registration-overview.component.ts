import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
import { Registration } from 'src/app/models/registration.model';
import { RegistrationService } from '../../../services/registration.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { GlobalConfig } from '../../../models/global-config.model';
import { EnvironmentsServiceService } from "src/app/services/environments-service.service";
import { EnvConfig } from "src/app/models/EnvConfig.model";

@Component({
  selector: 'app-registration-overview',
  templateUrl: './registration-overview.component.html',
  styleUrls: ['./registration-overview.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegistrationOverviewComponent implements OnInit, OnDestroy {
  registration: Registration;
  private gcSub: Subscription;
  browserCompatible: boolean = false;
  networkAccessible: boolean = false;

  pageConfig: any = {};
  pageConfigSub: Subscription;

  constructor(
    private regSvc: RegistrationService,
    private authSvc: AuthService,
    private deviceService: DeviceDetectorService,
    private http: HttpClient,
    private envConfigService: EnvironmentsServiceService
  ) {
    this.browserCheck();

    this.pageConfigSub = this.envConfigService.landingConfig.subscribe(
      (config: EnvConfig) => {
        this.pageConfig = config;
      }
    );
  }

  ngOnInit() {
    this.gcSub = this.authSvc
      .observeGlobalConfigUpdates()
      .subscribe((gc: GlobalConfig) => {
        if (gc) {
          this.fetchDefaultRegistration();
          this.networkCheck(gc['networkCheckURL']);
        }
      });
  }

  ngOnDestroy() {
    if (this.gcSub) {
      this.gcSub.unsubscribe();
    }
    this.pageConfigSub.unsubscribe();
  }

  get clsBannerText() {
    return this.pageConfig.classification
      ? `This page contains dynamic content -- Highest classification is: ${this.pageConfig.classification.toUpperCase()} FOR DEMONSTRATION PURPOSES ONLY`
      : '';
  }

  private fetchDefaultRegistration(): void {
    this.regSvc.fetchDefault().subscribe(
      (reg: Registration) => {
        this.registration = reg;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private browserCheck(): void {
    const deviceInfo = this.deviceService.getDeviceInfo();
    switch (deviceInfo.browser.toLowerCase()) {
      case 'chrome':
        this.browserCompatible = deviceInfo.browser_version >= '74';
        break;
      case 'firefox':
        this.browserCompatible = deviceInfo.browser_version >= '66';
        break;
      case 'opera':
        this.browserCompatible = deviceInfo.browser_version >= '58';
        break;
      default:
        break;
    }
  }

  private networkCheck(url): void {
    // this.http.get(url, { responseType: 'text' }).subscribe(
    //   () => {
    this.networkAccessible = true;
    //   },
    //   (error: any) => {
    //     console.error(error);
    //   }
    // );
  }

  get platformTooltip(): string {
    const tooltip = [];
    if (!this.browserCompatible) {
      tooltip.push(
        'Browser not supported. We recommend the latest version of Chrome.'
      );
    }
    if (!this.networkAccessible) {
      tooltip.push(
        'Necessary port blocked at the network level. Please contact an administrator.'
      );
    }
    return tooltip.join(' ');
  }
}
