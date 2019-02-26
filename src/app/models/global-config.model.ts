import {AdminCredentials} from './admin-credentials.model';

export interface GlobalConfig {

    docId?: string;
    ssoConnection?: string;
    realm?: string;
    realmDisplayName?: string;
    publicClientName?: string;
    publicClientId?: string;
    bearerClientName?: string;
    bearerClientId?: string;
    vendorsServiceConnection?: string;
    appsServiceConnection?: string;
    servicesServiceConnection?: string;
    dashboardServiceConnection?: string;
    pendingRoleId?: string;
    pendingRoleName?: string;
    approvedRoleId?: string;
    approvedRoleName?: string;
    administratorRoleId?: string;
    administratorRoleName?: string;

}