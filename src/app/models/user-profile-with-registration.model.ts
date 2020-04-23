import { UserProfileKeycloak } from './user-profile.model';

export interface UserProfileWithRegistration{
    userProfile: UserProfileKeycloak;
    docId: string;
}