import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { GlobalConfig } from "src/app/models/global-config.model";

@Component({
    selector: "app-registration-landing",
    templateUrl: "./registration-landing.component.html",
    styleUrls: ["./registration-landing.component.scss"]
})
export class RegistrationLandingComponent implements OnInit {

    externalRegisterUrl: string;

    constructor(private authSvc: AuthService) {
        this.authSvc.observeGlobalConfigUpdates().subscribe((globalConfig: GlobalConfig) => {
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
