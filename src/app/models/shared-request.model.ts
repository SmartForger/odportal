import { KeyValue } from "./key-value.model";

export interface SharedRequest{
    docId?: string;
    type?: string;
    name: string;
    endpoint: string;
    method: string;
    headers?: Array<KeyValue>;
    appIds: Array<string>;
    polling: number;
    data?: any;
}