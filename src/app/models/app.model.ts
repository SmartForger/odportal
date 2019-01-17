export interface App {

    docId?: string;
    appTag?: string;
    appRoot?: string;
    appBootstrap?: string;
    appTitle: string;
    appIconType?: string;
    appIcon?: string;
    enabled: boolean;
    native: boolean;
    nativePath?: string;
    createdAt?: string;
    roles?: Array<string>;
    vendorId?: string;
    active?: boolean;
    clientId: string;
    clientName: string;

}