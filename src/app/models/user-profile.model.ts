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
    address?: Address;
    alternateEmails: Array<string>;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    organizationMemberships?: Array<OrganizationMembership>;
    phone?: string;
    type?: string;
    userId: string;
}

export interface Address{
    city?: string;
    country?: string;
    state?: string;
    streetAddress?: string;
    streetAddressTwo?: string;
    zip?: string;
}

export interface OrganizationMembership{
    orgId: string;
    orgTitle: string;
    roleId: string;
    roleTitle: string;
}