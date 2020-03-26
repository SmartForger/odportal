import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
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

    pageConfig: any = {};
    pageConfigSub: Subscription;
    customCssInjected = false;

    constructor(
        private authSvc: AuthService,
        private envConfigService: EnvironmentsServiceService,
        private router: Router
    ) {
        this.pageConfigSub = this.envConfigService.landingConfig.subscribe(
            (config: EnvConfig) => {
                this.pageConfig = config;
                if (config.customCss && !this.customCssInjected) {
                    this.injectCss(config.customCssText);
                }
            }
        );
    }

    ngOnInit() { }

    ngOnDestroy() {
        this.pageConfigSub.unsubscribe();
    }

    ngAfterViewInit() {
        if (this.customCssInjected) {
            this.injectCss(this.pageConfig.customCssText);
        }
    }

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
        if (this.cssContainer) {
            this.cssContainer.nativeElement.appendChild(sheet);
        }
        this.customCssInjected = true;
    }
}
