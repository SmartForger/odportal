export interface LandingButtonConfig {
    icon: string;
    text: string;
    color: string;
    link: string;
    type: string;
}

export interface EnvConfig {
    docId?: string;
    name: string;
    classification: string;
    ownerName?: string;
    ownerId?: string;
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
    clsBanner?: boolean;
    clsBannerColor?: string;
    clsBannerText?: string;
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
}