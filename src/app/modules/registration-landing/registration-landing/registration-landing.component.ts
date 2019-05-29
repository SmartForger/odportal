import { Component, OnInit } from "@angular/core";
import { GlobalConfig } from "src/app/models/global-config.model";
import { environment as env } from "../../../../environments/environment";
import { ConfigService } from "src/app/services/config.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-registration-landing",
  templateUrl: "./registration-landing.component.html",
  styleUrls: ["./registration-landing.component.scss"]
})
export class RegistrationLandingComponent implements OnInit {
  constructor(private configSvc: ConfigService, private authSvc: AuthService) {}

  ngOnInit() {}

  login() {
    this.configSvc.fetchConfig().subscribe(
      (globalConfig: GlobalConfig) => {
        this.injectKeycloakAdapter(globalConfig);
      },
      err => {
        //TODO show modal indicating that the config was not found
        console.log(err);
      }
    );
  }

  private injectKeycloakAdapter(config: GlobalConfig): void {
    if (!env.testing) {
      let script = document.createElement("script");
      script.id = "keycloak-client-script";
      script.src = config.ssoConnection + "auth/js/keycloak.js";
      script.type = "text/javascript";
      script.onload = () => {
        this.authSvc.globalConfig = config;
      };
      document.body.appendChild(script);
    }
    //When testing, onload will never be called. Added this condition to set the config for tests.
    else {
      this.authSvc.globalConfig = config;
    }
  }
}
