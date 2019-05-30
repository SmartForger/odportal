import {UserProfile} from './user-profile.model';
import {ClientWithRoles} from './client-with-roles.model';

export interface UserState {

    userId: string;
    realm: string;
    userProfile: UserProfile;
    realmAccess: Array<string>;
    resourceAccess: Array<ClientWithRoles>;

}