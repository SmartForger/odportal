import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { GlobalConfig } from "src/app/models/global-config.model";
import { LandingButtonConfig } from "src/app/models/EnvConfig.model";
import { EnvironmentsServiceService } from "src/app/services/environments-service.service";

@Component({
    selector: "app-registration-landing",
    templateUrl: "./registration-landing.component.html",
    styleUrls: ["./registration-landing.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class RegistrationLandingComponent implements OnInit {

    externalRegisterUrl: string;
    pageConfig: any = {};

    constructor(
        private authSvc: AuthService,
        private envConfigService: EnvironmentsServiceService,
        private router: Router
    ) {
        this.authSvc.observeGlobalConfigUpdates().subscribe((globalConfig: GlobalConfig) => {
            if (globalConfig && globalConfig.appsServiceConnection) {
                const boundUrl = globalConfig.appsServiceConnection.split('/apps-service')[0];
                this.envConfigService.getLandingConfig(boundUrl)
                    .subscribe((result) => {
                        this.pageConfig = result;
                    });
            }

            if(globalConfig && globalConfig.externalRegisterUrl){
                this.externalRegisterUrl = globalConfig.externalRegisterUrl;
            }
            else{
                this.externalRegisterUrl = null;
            }
        });
    }

    ngOnInit() { }

    login() {
        this.authSvc.login();
    }

    landingButtonClick(btn: LandingButtonConfig) {
        console.log(btn);

        switch (btn.type) {
            case "loginCAC":
            case "loginUser":
                this.login();
                break;

            case "register":
                this.router.navigate([btn.link]);
                break;
            
            default:
                break;
        }
    }

    getStyles(color) {
        return {
            backgroundColor: color
        };
    }
}
