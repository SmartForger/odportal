import {UserProfileKeycloak} from './user-profile.model';

export interface Vendor {

    docId?: string;
    type?: string;
    name: string;
    pocPhone: string;
    pocEmail: string;
    website?: string;
    logoImage?: string;
    createdAt?: string;
    users?: Array<UserProfileKeycloak>;
    description?: string;
}