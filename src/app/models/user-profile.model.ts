export interface UserProfile {

    firstName: string;
    lastName: string;
    username: string;
    emailVerified?: boolean;
    email: string;
    attributes?: Object;
    enabled?: boolean;
    id?: string

}