import { GridsterItem } from "angular-gridster2";

export interface WidgetGridItem {

    gridId: string;
    gridsterItem: GridsterItem;
    parentAppId: string;
    state?: any;
    widgetId: string;

}