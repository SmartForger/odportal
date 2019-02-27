import { GridsterItem } from "angular-gridster2";

export interface Widget {

    docId?: string;
    widgetTitle: string;
    widgetTag: string;
    widgetBootstrap: string;
    gridsterDefault?: GridsterItem;
    icon?: string;
}