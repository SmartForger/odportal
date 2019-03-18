export enum ConnectionStatus {
    Pending = 1,
    Success,
    Failed
};

export enum CommonLocalStorageKeys {
    RedirectURI = "redirectURI"
};

export const HttpSignatureKey: string = "od360-request-signature";