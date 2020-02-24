import { Input } from "@angular/core";

export class BasePanelComponent {
  config: any;

  get environment() {
    return this.config;
  }
  @Input()
  set environment(config: any) {
    if (!config) {
      return;
    }

    this.config = config;
    this.resetUndefinedValues();
  }

  static readonly defaultConfig = {
    pageTitle: "",
    clsBanner: false,
    clsBannerText: "",
    clsBannerColor: "#04874D",
    thirdPartyRegistration: false,
    classification: "unclassified",
    infoBanner: false,
    infoBannerText: "",
    infoBannerColor: "#04874D",
    infoBannerIcon: "info",
    pushToEnvs: [],
    introTitle: "",
    introText: "",
    supTitle: "",
    supText: "",
    environment: "",
    ssoUrl: "",
    rcsUrl: "",
    regThirdPartyUrl: "",
    nativeRelay: false,
    smtpServer: "",
    allowPasswordReset: false
  };

  constructor() {
    this.config = {};
  }

  private resetUndefinedValues() {
    const keys = Object.keys(BasePanelComponent.defaultConfig);
    keys.forEach(key => {
      if (this.config[key] === undefined) {
        if (key === 'pushToEnvs') {
          this.config[key] = [];
        } else {
          this.config[key] = BasePanelComponent.defaultConfig[key];
        }
      }
    });
  }
}
