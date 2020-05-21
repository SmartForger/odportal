import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthService } from "src/app/services/auth.service";
import { LandingButtonConfig, EnvConfig } from "src/app/models/EnvConfig.model";
import { EnvironmentsServiceService } from "src/app/services/environments-service.service";
import { FAQModel } from "src/app/models/faq.model";
import { FaqService } from "src/app/services/faq.service";
import { VideoModel } from 'src/app/models/video.model';
import { VideoService } from 'src/app/services/video.service';
import { VideoDialogComponent } from '../video-dialog/video-dialog.component';
import { ConsentModalComponent } from "../consent-modal/consent-modal.component";
import { CommunicationErrorComponent } from "../communication-error/communication-error.component";
import { trigger, transition, animate, style } from "@angular/animations";

declare var InstallTrigger: any;
declare var window: any;
declare var document: any;
declare var opr: any;

@Component({
    selector: "app-registration-landing",
    templateUrl: "./registration-landing.component.html",
    styleUrls: ["./registration-landing.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: [
      trigger('appearAnim', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('300ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          animate('300ms', style({ opacity: 0 }))
        ])
      ])
    ]
})
export class RegistrationLandingComponent implements OnInit {
    @ViewChild('customCss') cssContainer: ElementRef<HTMLElement>;

    pageConfig: any = {};
    pageConfigSub: Subscription;
    customCssInjected = false;

    compatibility = {
      browser: "",
      browserImage: "/assets/images/landing_browser-unknown.png",
      version: "",
      userAgent: "",
      platform: "",
      platformImage: "/assets/images/landing_os-unknown.png"
    };

    faqTopics = [
      {
        value: 'account',
        label: 'Account'
      },
      {
        value: 'network',
        label: 'Network'
      },
      {
        value: 'system',
        label: 'System'
      },
      {
        value: 'registration',
        label: 'Registration'
      }
    ];
    selectedFaqTopics = [];
    faqs: FAQModel[] = [];


    videoTopics = [
      {
        value: 'account',
        label: 'Account'
      },
      {
        value: 'network',
        label: 'Network'
      },
      {
        value: 'system',
        label: 'System'
      },
      {
        value: 'registration',
        label: 'Registration'
      }
    ];
    selectedVideoTopics = [];
    videos: VideoModel[] = [];

    speedTest = {
      app: {
        "apiCalls": [],
        "appIcon": "chat",
        "appIconType": "icon",
        "appTitle": "Admin Widgets",
        "clientId": null,
        "clientName": null,
        "createdAt": "2019-01-09T00:23:28.982Z",
        "docId": "admin-widgets",
        "enabled": true,
        "native": true,
        "nativePath": null,
        "roles": [],
        "type": "app",
        "widgets": [
          {
            "descriptionFull": null,
            "descriptionShort": "Tests network conditions: IP, ping, jitter, upload speed, and download speed.",
            "docId": "speedtest-widget",
            "icon": "widget-ico_speedtest.png",
            "iconType": "image",
            "widgetBootstrap": "speedtest-widget.js",
            "widgetTag": "speedtest-widget",
            "widgetTitle": "Network Speed Test"
          }
        ]
      },
      widget: {
        "descriptionFull": null,
        "descriptionShort": "Tests network conditions: IP, ping, jitter, upload speed, and download speed.",
        "docId": "speedtest-widget",
        "icon": "widget-ico_speedtest.png",
        "iconType": "image",
        "widgetBootstrap": "speedtest-widget.js",
        "widgetTag": "speedtest-widget",
        "widgetTitle": "Network Speed Test"
      }
    }

    browserCompatVisible: boolean = false;
    readonly browserCompatDetails = {
      title: "Browser Support",
      message: "You are using an unsupported browser.",
      details: `The platform requires you use modern browsers supporting webkit display technologies, such as <a href="https://www.google.com/chrome/">Google Chrome</a>, <a href="https://www.mozilla.org/en-US/exp/firefox/new/">Mozilla Firefox</a>.`
    }

    constructor(
        private authSvc: AuthService,
        private envConfigService: EnvironmentsServiceService,
        private faqService: FaqService,
        private videoSvc: VideoService,
        private router: Router,
        private dialog: MatDialog
    ) {
        this.pageConfigSub = this.envConfigService.landingConfig.subscribe(
            (config: EnvConfig) => {
                this.pageConfig = config;
                if (config.customCss && !this.customCssInjected) {
                    this.injectCss(config.customCssText);
                }

                if (this.pageConfig.faqEnabled) {
                  this.getFAQs();
                }

                if (this.pageConfig.videosEnabled) {
                  this.getVideos();
                }

                this.checkConsent();
            }
        );
    }

    ngOnInit() {
      this.checkBrowserCompatibility();
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
        switch (btn.type) {
            case "loginCAC":
            case "loginUser":
                this.login();
                break;

            case "linkInternal":
                this.router.navigate([btn.link]);
                break;

            case "linkExternal":
                window.open(btn.link, btn.target || '_blank');
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

    selectFaqTopic(opt) {
      console.log('select faq topic', opt);
      if (this.selectedFaqTopics.indexOf(opt) < 0) {
        this.selectedFaqTopics.push(opt);
      }
    }

    removeSelectedTopic(opt) {
      this.selectedFaqTopics = this.selectedFaqTopics.filter(t => t.value !== opt.value);
    }

    removeAllTopics(ev) {
      ev.stopPropagation();
      this.selectedFaqTopics = [];
    }

    selectVideoTopic(opt) {
      if (this.selectedVideoTopics.indexOf(opt) < 0) {
        this.selectedVideoTopics.push(opt);
      }
    }

    removeSelectedVideoTopic(opt) {
      this.selectedVideoTopics = this.selectedVideoTopics.filter(t => t.value !== opt.value);
    }

    removeAllVideoTopics(ev) {
      ev.stopPropagation();
      this.selectedVideoTopics = [];
    }

    thumbnailSrc(video: VideoModel): string {
      return this.videoSvc.getUploadPath() + '/' + video.thumbnail;
    }

    openVideoDialog(video: VideoModel) {
      this.dialog.open(VideoDialogComponent, { data: video });
    }
  
    get backgroundUrl() {
        return this.pageConfig.pageBackground ? `url(${this.pageConfig.pageBackground})` : '';
    }

    get clsBannerText() {
        return this.pageConfig.classification
            ? `This page contains dynamic content -- Highest classification is: ${this.pageConfig.classification.toUpperCase()} FOR DEMONSTRATION PURPOSES ONLY`
            : '';
    }

    get supportEmailLink() {
      return this.pageConfig.supportEmail
        ? `mailto:${this.pageConfig.supportEmail}?subject=PCTE Browser Support Issue&body=BROWSER DETAILS%0D%0A%0D%0ABrowser: ${this.compatibility.browser}%0D%0ABrowser Version:${this.compatibility.version}%0D%0AOS Version: ${this.compatibility.version}%0D%0AUser Agent: ${this.compatibility.userAgent}`
        : '';
    }

    get availableFaqTopics() {
      return this.faqTopics.filter(t => this.selectedFaqTopics.every(t1 => t.value !== t1.value));
    }

    get availableVideoTopics() {
      return this.videoTopics.filter(t => this.selectedVideoTopics.every(t1 => t.value !== t1.value));
    }

    get filteredFaqs() {
      if (this.selectedFaqTopics.length === 0) {
        return this.faqs;
      }

      return this.faqs.filter(faq => this.selectedFaqTopics.some(t => t.value === faq.category));
    }

    get filteredVideos() {
      if (this.selectedVideoTopics.length === 0) {
        return this.videos;
      }

      return this.videos.filter(video => this.selectedVideoTopics.some(t => video.keywords && video.keywords.indexOf(t.value) >= 0))
    }

    checkConsent() {
      if (this.pageConfig && this.pageConfig.docId) {

        const confirmed = localStorage.getItem("consent_confirmed");
        const closed = Number(localStorage.getItem("consent_closed"));
        const ts = new Date().getTime();

        if (!(confirmed === "true" && ts < (closed + 60 * 86400000))) {
          const dlgRef = this.dialog.open(ConsentModalComponent, {
            disableClose: true,
            data: this.pageConfig
          });

          dlgRef.afterClosed().subscribe(result => {
            if (result === 'disagree') {
              this.dialog.open(CommunicationErrorComponent, {
                disableClose: true
              });
            }
          });
        }
      }
    }

    showBrowserCompatDetails() {
      this.browserCompatVisible = true;
    }

    hideBrowserCompatDetails() {
      this.browserCompatVisible = false;
    }

    private injectCss(text) {
        const sheet = document.createElement('style');
        sheet.innerHTML = text;
        if (this.cssContainer) {
            this.cssContainer.nativeElement.appendChild(sheet);
        }
        this.customCssInjected = true;
    }

    private getFAQs() {
      this.faqService.getFAQs().subscribe((faqs: FAQModel[]) => {
        this.faqs = faqs;

        const topics = [];
        this.faqs.forEach(faq => {
          if (faq.category && !topics.find(t => t.value === faq.category)) {
            topics.push({
              label: faq.category,
              value: faq.category
            });
          }
        });

        console.log(topics)
        this.faqTopics = topics;
      });
    }

    private getVideos() {
      this.videoSvc.getVideos(this.pageConfig.docId).subscribe((videos: VideoModel[]) => {
        this.videos = videos.filter(v => v.status === 'published');

        const topics = [];
        this.videos.forEach(video => {
          if (!video.keywords) {
            return;
          }

          video.keywords.forEach(k => {
            if (!topics.find(t => t.value === k)) {
              topics.push({
                label: k,
                value: k
              });
            }
          });
        });
        this.videoTopics = topics;
      });
    }

    checkBrowserCompatibility() {
        // Opera 8.0+
        const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        // Firefox 1.0+
        const isFirefox = typeof InstallTrigger !== 'undefined';
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
          this.compatibility.browser = "Edge";
          this.compatibility.version = getVersion("Edg");
          this.compatibility.browserImage = "/assets/images/landing_browser-edge.png";
        } else if (isChromium) {
          this.compatibility.browser = "Chromium";
          this.compatibility.version = getVersion("Chromium");
          this.compatibility.browserImage = "/assets/images/landing_browser-chromium.png";
        } else if (isChrome) {
          this.compatibility.browser = "Google Chrome";
          this.compatibility.version = getVersion("Chrome");
          this.compatibility.browserImage = "/assets/images/landing_browser-chrome.png";
        } else if (isFirefox) {
          this.compatibility.browser = "Firefox";
          this.compatibility.version = getVersion("Firefox");
          this.compatibility.browserImage = "/assets/images/landing_browser-firefox.png";
        } else if (isOpera) {
          this.compatibility.browser = "Opera";
          this.compatibility.version = getVersion("Opera|OPR");
          this.compatibility.browserImage = "/assets/images/landing_browser-opera.png";
        } else {
          this.compatibility.browser = "Unknown";
          this.compatibility.browserImage = "/assets/images/landing_browser-unknown.png";
        }

        this.compatibility.userAgent = navigator.userAgent;

        switch (this.compatibility.platform) {
          case 'Win32':
            this.compatibility.platform = "Windows";
            this.compatibility.platformImage = "/assets/images/landing_os-windows.png";
            break;
          case 'Linux x86_64':
            this.compatibility.platform = "Linux";
            this.compatibility.platformImage = "/assets/images/landing_os-linux.png";
            break;
          case 'MacIntel':
            this.compatibility.platform = "Mac OS";
            this.compatibility.platformImage = "/assets/images/landing_os-mac.png";
            break;
          default:
            this.compatibility.platform = "Unknown";
            this.compatibility.platformImage = "/assets/images/landing_os-unknown.png";
            break;
        }

        if (navigator.userAgent.indexOf("Ubuntu")) {
          this.compatibility.platform = "Ubuntu";
          this.compatibility.platformImage = "/assets/images/landing_os-ubuntu.png";
        }
    }
}
