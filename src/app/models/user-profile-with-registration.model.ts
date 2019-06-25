import { UserProfile } from './user-profile.model';

export interface UserProfileWithRegistration{
    userProfile: UserProfile;
    docId: string;
}