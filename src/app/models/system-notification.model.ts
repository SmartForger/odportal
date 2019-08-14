export enum LaunchType {
    MicroApp = "microapp",
    Widget = "widget"
}

export enum Priority {
    Critical = 1,
    HighPriority = 2,
    LowPriority = 3,
    Passive = 4
}

export enum IconType {
    Image = "image",
    Icon = "icon"
}

export interface SystemNotification {

    docId?: string;
    type?: string;
    subject: string;
    message: string;
    createdAt?: string;
    icon?: {
        type: IconType,
        source: string
    },
    priority: Priority,
    target?: {
        users: Array<string>,
        roles: Array<string>
    },
    launch?: {
        type: LaunchType,
        id: string,
        state: Object
    }
    timestamp?: string; //local use only

}

export interface ReadReceipt {

    docId?: string;
    type?: string;
    notificationId: string;
    userId?: string;
    createdAt?: string;

}

export interface TotalNotifications {

    priority: Priority;
    total: number;
    date?: string;

}