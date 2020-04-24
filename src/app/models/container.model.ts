import { AppIconType } from "./app.model";

export interface Container{
    branches: Array<Branch>;
    root: any;
}

export type Branch = {
    apps: Array<string>;
    icon: string;
    iconType: AppIconType;
    title: string;
}