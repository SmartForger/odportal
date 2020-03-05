import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { GlobalConfig } from "src/app/models/global-config.model";
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

    constructor(private authSvc: AuthService, private envConfigService: EnvironmentsServiceService) {
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
}
