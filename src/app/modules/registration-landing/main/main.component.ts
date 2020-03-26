import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { EnvironmentsServiceService } from "src/app/services/environments-service.service";
import { GlobalConfig } from "src/app/models/global-config.model";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {
  constructor(
    private authSvc: AuthService,
    private envConfigSvc: EnvironmentsServiceService
  ) {
    this.authSvc
      .observeGlobalConfigUpdates()
      .subscribe((globalConfig: GlobalConfig) => {
        if (globalConfig && globalConfig.appsServiceConnection) {
          const boundUrl = globalConfig.appsServiceConnection.split(
            "/apps-service"
          )[0];
          this.envConfigSvc.getLandingConfig(boundUrl);
        }
      });
  }

  ngOnInit() {}
}
