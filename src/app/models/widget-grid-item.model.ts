import { GridsterItem } from "angular-gridster2";

export interface WidgetGridItem {

    parentAppTitle: string; //Will not be stored by the API
    widgetTitle: string; //Will not be stored by the API
    widgetId?: string; //TODO make it required
    gridsterItem: GridsterItem;

}