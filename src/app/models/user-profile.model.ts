export interface UserProfileKeycloak {

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

export interface UserProfile {
    alternateEmails: Array<string>;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    organizationMemberships?: Array<OrganizationMembership>;
    type?: string;
    userId: string;
}

export interface OrganizationMembership{
    orgId: string;
    orgTitle: string;
    roleId: string;
    roleTitle: string;
}