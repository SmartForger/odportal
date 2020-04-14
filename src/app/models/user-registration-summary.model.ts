import { UserProfileKeycloak } from "./user-profile.model";

export interface UserRegistrationSummary {
    docId: string;
    status: string;
    userProfile: UserProfileKeycloak;
    registrationId: string;
    registrationTitle: string;
    bindings: any;
}