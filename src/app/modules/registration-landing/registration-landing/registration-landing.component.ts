import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { AuthService } from "src/app/services/auth.service";
import { GlobalConfig } from "src/app/models/global-config.model";
import { LandingButtonConfig, EnvConfig } from "src/app/models/EnvConfig.model";
import { EnvironmentsServiceService } from "src/app/services/environments-service.service";

declare var InstallTrigger: any;
declare var window: any;
declare var document: any;
declare var opr: any;
declare var safari: any;

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

    compatibility = {
        browser: "",
        version: "",
        userAgent: "",
        platform: ""
      };

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

    ngOnInit() {
        // Opera 8.0+
        const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        // Firefox 1.0+
        const isFirefox = typeof InstallTrigger !== 'undefined';
        // Safari 3.0+ "[object HTMLElementConstructor]" 
        const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
        // Internet Explorer 6-11
        const isIE = /*@cc_on!@*/false || !!document.documentMode;
        // Edge 20+
        const isEdge = !isIE && !!window.StyleMedia;
        // Chrome 1 - 79
        const isChrome = (!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)) ||
            (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor));
        // Chromium
        const isChromium = isChrome && navigator.userAgent.indexOf("Chromium") != -1;
        // Edge (based on chromium) detection
        const isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);
    
        const getVersion = browser => {
          const regex = new RegExp(`(${browser})/([^ ]+)`);
          const matches = navigator.appVersion.match(regex);
          return matches && matches[2];
        }
    
        if (isEdgeChromium) {
          this.compatibility.browser = "Edge Chromium";
          this.compatibility.version = getVersion("Edg");
        } else if (isChromium) {
          this.compatibility.browser = "Chromium";
          this.compatibility.version = getVersion("Chromium");
        } else if (isChrome) {
          this.compatibility.browser = "Google Chrome";
          this.compatibility.version = getVersion("Chrome");
        } else if (isFirefox) {
          this.compatibility.browser = "Mozilla Firefox";
          this.compatibility.version = getVersion("Firefox");
        } else if (isSafari) {
          this.compatibility.browser = "Safari";
          this.compatibility.version = getVersion("Safari");
        } else if (isOpera) {
          this.compatibility.browser = "Opera";
          this.compatibility.version = getVersion("Opera|OPR");
        } else if (isEdge) {
          this.compatibility.browser = "Edge";
          this.compatibility.version = getVersion("Edg");
        } else if (isIE) {
          this.compatibility.browser = "Internet Explorer";
    
          let matches = navigator.userAgent.match(/MSIE ([\.0-9]+)/);
          if (matches) {
            this.compatibility.version = matches[1];
          } else {
            matches = navigator.userAgent.match(/rv:([\.0-9]+)/);
            if (matches) {
              this.compatibility.version = matches[1];
            }
          }
        }
    
        this.compatibility.userAgent = navigator.userAgent;
        this.compatibility.platform = navigator.platform;
      }

      

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
