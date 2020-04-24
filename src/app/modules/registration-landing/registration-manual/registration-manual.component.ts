import { Component, OnInit } from '@angular/core';
import { EnvironmentsServiceService } from "src/app/services/environments-service.service";
import { EnvConfig } from "src/app/models/EnvConfig.model";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-registration-manual',
  templateUrl: './registration-manual.component.html',
  styleUrls: ['./registration-manual.component.scss']
})
export class RegistrationManualComponent implements OnInit {

  pageConfig: any = {};
  pageConfigSub: Subscription;

  constructor(private envConfigService: EnvironmentsServiceService) {
    this.pageConfigSub = this.envConfigService.landingConfig.subscribe(
      (config: EnvConfig) => {
        this.pageConfig = config;
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.pageConfigSub.unsubscribe();
  }

  get clsBannerText() {
    return this.pageConfig.classification
      ? `This page contains dynamic content -- Highest classification is: ${this.pageConfig.classification.toUpperCase()} FOR DEMONSTRATION PURPOSES ONLY`
      : '';
  }

}
