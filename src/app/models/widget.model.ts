import { GridsterItem } from "angular-gridster2";

export interface Widget {

    docId?: string;
    widgetTitle: string;
    widgetTag: string;
    widgetBootstrap: string;
    gridsterDefault?: GridsterItem;
    iconType?: string;
    icon?: string;
    state?: any;
    descriptionShort: string;
    descriptionFull?: string;
    rating?: number;
}