import {ApiRequestHeader} from './api-request-header.model';

export interface ApiRequest {

    uri: string;
    verb: string;
    body?: any;
    headers?: Array<ApiRequestHeader>;
    onSuccess: Function;
    onError: Function;
    onProgress?: Function;
    appId?: string;
    widgetId?: string;
    succeeded?: boolean;
    response?: any;
    responseAsJSON?: boolean;

}