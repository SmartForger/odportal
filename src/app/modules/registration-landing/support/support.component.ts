import { Component, OnInit } from '@angular/core';
import { EnvironmentsServiceService } from "src/app/services/environments-service.service";
import { EnvConfig } from "src/app/models/EnvConfig.model";
import { Subscription } from 'rxjs';

declare var InstallTrigger: any;
declare var window: any;
declare var document: any;
declare var opr: any;
declare var safari: any;

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  pageConfig: any = {};
  pageConfigSub: Subscription;

  compatibility = {
    browser: "",
    version: "",
    userAgent: "",
    platform: ""
  };

  constructor(private envConfigService: EnvironmentsServiceService) {
    this.pageConfigSub = this.envConfigService.landingConfig.subscribe(
      (config: EnvConfig) => {
        this.pageConfig = config;
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

  get clsBannerText() {
    return this.pageConfig.classification
      ? `This page contains dynamic content -- Highest classification is: ${this.pageConfig.classification.toUpperCase()} FOR DEMONSTRATION PURPOSES ONLY`
      : '';
  }

}
