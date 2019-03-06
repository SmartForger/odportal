import { GridsterItem } from "angular-gridster2";

export interface WidgetGridItem {

    parentAppId: string;
    widgetId?: string; //TODO make it required
    gridsterItem: GridsterItem;

}