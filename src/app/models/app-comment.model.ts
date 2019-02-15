export interface AppComment {

    docId?: string;
    senderFirstName?: string;
    senderLastName?: string;
    createdAt?: string;
    message: string;
    isFromVendor: boolean;

}