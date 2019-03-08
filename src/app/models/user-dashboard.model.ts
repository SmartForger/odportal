import {WidgetGridItem} from './widget-grid-item.model';

export interface UserDashboard {

    docId?: string;
    type?: string;
    title?: string; //TODO: Make it required
    description?: string; //TODO: Make it required
    userId: string;
    gridItems: Array<WidgetGridItem>;
    default: boolean;

}

export namespace UserDashboard{
    export function createDefaultDashboard(userId: string): UserDashboard{
        return {
            type: 'UserDashboard',
            title: 'New Dashboard',
            description: '',
            userId: userId,
            gridItems: [],
            default: false
        }
    }
}