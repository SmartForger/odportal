import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { GlobalConfig } from "src/app/models/global-config.model";
import { LandingButtonConfig, EnvConfig } from "src/app/models/EnvConfig.model";
import { EnvironmentsServiceService } from "src/app/services/environments-service.service";

@Component({
    selector: "app-registration-landing",
    templateUrl: "./registration-landing.component.html",
    styleUrls: ["./registration-landing.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class RegistrationLandingComponent implements OnInit {
    @ViewChild('customCss') cssContainer: ElementRef<HTMLElement>;

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
                    .subscribe((result: EnvConfig) => {
                        this.pageConfig = result;

                        if (result.customCss) {
                            this.injectCss(result.customCssText);
                        }
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

            case "linkInternal":
                this.router.navigate([btn.link]);
                break;

            case "linkExternal":
                window.open(btn.link);
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

    get backgroundUrl() {
        return this.pageConfig.pageBackground ? `url(${this.pageConfig.pageBackground})` : '';
    }

    get clsBannerText() {
        return this.pageConfig.classification
            ? `This page contains dynamic content -- Highest classification is: ${this.pageConfig.classification.toUpperCase()} FOR DEMONSTRATION PURPOSES ONLY`
            : '';
    }

    private injectCss(text) {
        const sheet = document.createElement('style');
        sheet.innerHTML = text;
        this.cssContainer.nativeElement.appendChild(sheet);
    }
}
