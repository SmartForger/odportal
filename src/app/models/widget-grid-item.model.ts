import { GridsterItem } from "angular-gridster2";

export interface WidgetGridItem {

    parentAppTitle: string;
    widgetTitle: string;
    widgetId?: string; //TODO make it required
    gridsterItem: GridsterItem;

}