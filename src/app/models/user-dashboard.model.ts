import {WidgetGridItem} from './widget-grid-item.model';

export interface UserDashboard {

    userId: string;
    gridItems: Array<WidgetGridItem>;

}