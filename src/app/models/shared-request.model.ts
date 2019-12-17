import { KeyValue } from "./key-value.model";

export interface SharedRequest{
    appIds: Array<string>;
    data?: any;
    docId?: string;
    enablePolling?: boolean;
    endpoint?: string;
    headers?: Array<KeyValue>;
    method?: string;
    name: string;
    parameter?: string;
    polling?: number;
    requestType: string;
    type?: string;
    wpmType?: string;
}