export interface ApiRequestHeader {

    key: string;
    value: string;

}

export interface ApiRequest {

    uri: string;
    verb: string;
    body?: any;
    headers?: Array<ApiRequestHeader>;
    onSuccess: Function;
    onError: Function;
    onProgress?: Function;

}