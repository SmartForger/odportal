import {GlobalConfig} from './global-config.model';
import {AdminCredentials} from './admin-credentials.model';
import {RoleRepresentation} from './role-representation.model';
import {AccountRepresentation} from './account-representation.model';

export interface UpdateConfig {

    globalConfig: GlobalConfig;
    adminCredentials: AdminCredentials;
    adminRole: RoleRepresentation;
    vendorRole: RoleRepresentation;
    userRole: RoleRepresentation;
    adminAccount: AccountRepresentation;

}