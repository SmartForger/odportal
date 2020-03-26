export interface LandingButtonConfig {
    icon: string;
    text: string;
    color: string;
    link: string;
    type: string;
    visible?: boolean;
}

export interface EnvConfig {
    docId?: string;
    name: string;
    classification: string;
    supportEmail?: string;
    activeSessions?: string;
    status?: string;
    ssoUrl: string;
    boundUrl: string;
    nativeRegistration?: boolean;
    thirdPartyEndPoint?: string;
    smtpNativeRelay?: boolean;
    smtpServer?: string;
    allowPasswordReset?: boolean;
    pageTitle?: string;
    pageIcon?: string;
    pageBackground?: string;
    infoBanner?: boolean;
    infoBannerText?: string;
    infoBannerIcon?: string;
    infoBannerColor?: string;
    broadcastEnvs?: string;
    systemConsent?: boolean;
    introTitle?: string;
    introText?: string;
    introIconFile?: string;
    supplementaryTitle?: string;
    supplementaryText?: string;
    landingButtons?: LandingButtonConfig[];
    consentTitle?: string;
    consentSupplementary?: string;
    consentBody?: string;
    customCss?: boolean;
    customCssText?: string;
    supportEnabled?: boolean;
    supportTitle?: string;
    supportOverview?: string;
    faqEnabled?: boolean;
    videosEnabled?: boolean;
    tutorialsEnabled?: boolean;
    supporterName?: string;
}