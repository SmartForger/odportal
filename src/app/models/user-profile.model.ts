export interface UserProfile {

    attributes?: Object;
    email: string;
    emailVerified?: boolean;
    enabled?: boolean;
    firstName: string;
    id?: string
    lastName: string;
    username: string;
    vendorId?: string;
    vendorName?: string;

}

export interface UserProfileOD360 {
    alternateEmails: Array<string>;
    email: string;
    firstName: string;
    lastName: string;
    type?: string;
    userId: string;
}