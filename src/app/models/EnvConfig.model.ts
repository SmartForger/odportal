export interface LandingButtonConfig {
    icon: string;
    text: string;
    color: string;
    link: string;
    type: string;
    visible?: boolean;
    target?: string;
}

export interface EnvConfig {
    docId?: string;
    name?: string;
    classification?: string;
    supporterName?: string;
    supportEmail?: string;
    activeSessions?: string;
    status?: string;
    ssoUrl?: string;
    boundUrl?: string;
    nativeRegistration?: boolean;
    thirdPartyEndPoint?: string;
    smtpNativeRelay?: boolean;
    smtpServer?: string;
    smtpPort?: string;
    smtpFromName?: string;
    smtpFromEmail?: string;
    smtpReplyName?: string;
    smtpReplyEmail?: string;
    smtpEnvelopeFrom?: string;
    smtpSSLEnabled?: boolean;
    smtpStartTLSEnabled?: boolean;
    smtpAuthEnabled?: boolean;
    smtpUser?: string;
    smtpPassword?: string;
    allowPasswordReset?: boolean;
    pageTitle?: string;
    pageIcon?: string;
    pageBackground?: string;
    infoBanner?: boolean;
    infoBannerText?: string;
    infoBannerIcon?: string;
    infoBannerColor?: string;
    introTitle?: string;
    introText?: string;
    introIconFile?: string;
    supplementaryTitle?: string;
    supplementaryText?: string;
    landingButtons?: LandingButtonConfig[];
    systemConsent?: boolean;
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
    compatibilityEnabled?: boolean;
    speedTestEnabled?: boolean;
    tutorialsEnabled?: boolean;
    ownerName?: string;
}