import { GridsterItem } from "angular-gridster2";

export interface Widget {
    customId?: string;
    descriptionFull?: string;
    descriptionShort: string;
    docId?: string;
    gridsterDefault?: GridsterItem;
    icon?: string;
    iconType?: string;
    state?: any;
    widgetBootstrap: string;
    widgetTag: string;
    widgetTitle: string;
}