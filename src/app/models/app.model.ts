import {Widget} from './widget.model';
import {ExternalPermission} from './external-permission.model';
import {AppComment} from './app-comment.model';
import { ApiCallDescriptor } from './api-call-descriptor.model';

export interface App {
    active?: boolean;
    apiCalls?: Array<ApiCallDescriptor>;
    appBootstrap?: string;
    appRoot?: string;
    appTag?: string;
    appIconType?: AppIconType;
    appIcon?: string;
    approved?: boolean;
    appTitle: string;
    clientId: string;
    clientName: string;
    comments?: Array<AppComment>;
    createdAt?: string;
    description?: string;
    docId?: string;
    enabled: boolean;
    externalPermissions?: Array<ExternalPermission>;
    native: boolean;
    nativePath?: string;
    permissions?: Array<string>;
    renderContext?: AppRenderingContext;
    roles?: Array<string>;
    trusted?: boolean;
    vendorId?: string;
    version?: string;
    widgets?: Array<Widget>;
}

export enum AppIconType{
    ICON = 'icon',
    IMAGE = 'image'
}

export enum AppRenderingContext{
    'application',
    'user-profile-extension'
}