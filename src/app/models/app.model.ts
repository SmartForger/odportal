import {Widget} from './widget.model';
import {ExternalPermission} from './external-permission.model';
import {AppComment} from './app-comment.model';
import { ApiCallDescriptor } from './api-call-descriptor.model';

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
    version?: string;
    permissions?: Array<string>;
    approved?: boolean;
    trusted?: boolean;
    widgets?: Array<Widget>;
    externalPermissions?: Array<ExternalPermission>;
    comments?: Array<AppComment>;
    apiCalls?: Array<ApiCallDescriptor>;

}