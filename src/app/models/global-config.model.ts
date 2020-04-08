export interface GlobalConfig {

    ssoConnection?: string;
    realm?: string;
    publicClientId?: string;
    vendorsServiceConnection?: string;
    appsServiceConnection?: string;
    userProfileServiceConnection?: string;
    feedbackServiceConnection?: string;
    registrationServiceConnection?: string;
    notificationsServiceConnection?: string;
    certificationsServiceConnection?: string;
    speedtestServiceConnection?: string;
    mattermostProxyServiceConnection?: string;
    pendingRoleId?: string;
    pendingRoleName?: string;
    approvedRoleId?: string;
    approvedRoleName?: string;
    verificationManagerRoleId?: string;
    verificationManagerRoleName?: string;
    cacDNQueryParam?: string;
    cacCNQueryParam?: string;
    cacEmailQueryParam?: string;
    cacAuthURL?: string;
    openviduProxyServiceConnection?: string;
    registrationOnly?: boolean;
    registrationManagerRoleId?: string;
    registrationManagerRoleName?: string;
    externalRegisterUrl?: string;
    eventsProxyServiceConnection?: string;
    enableRegistration?: boolean;
}