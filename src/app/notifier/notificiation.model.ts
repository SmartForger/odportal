export enum NotificationType {

    Success = 'success',
    Warning = 'warning',
    Error = 'error',
    INFO = 'info'

}

export interface Notification {

    type: NotificationType;
    message: string;
    icon?: string;
    link?: string;
    linkText?: string;
    action?: string;

}