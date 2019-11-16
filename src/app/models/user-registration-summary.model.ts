import { UserProfile } from "./user-profile.model";

export interface UserRegistrationSummary {
    docId: string;
    status: string;
    userProfile: UserProfile;
    registrationId: string;
    registrationTitle: string;
    bindings: any;
}