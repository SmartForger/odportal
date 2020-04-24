import {UserProfileKeycloak} from './user-profile.model';
import {ClientWithRoles} from './client-with-roles.model';

export interface UserState {

    userId: string;
    bearerToken: string;
    realm: string;
    userProfile: UserProfileKeycloak;
    realmAccess: Array<string>;
    resourceAccess: Array<ClientWithRoles>;

}