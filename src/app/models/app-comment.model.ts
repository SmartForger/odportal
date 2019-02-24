export interface AppComment {

    docId?: string;
    senderFirstName?: string;
    senderLastName?: string;
    senderId?: string;
    createdAt?: string;
    message: string;
    isFromVendor: boolean;

}