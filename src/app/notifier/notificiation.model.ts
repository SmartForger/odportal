export enum NotificationType {

    Success = 'success',
    Warning = 'warning',
    Error = 'error'

}

export interface Notification {

    type: NotificationType;
    message: string;

}