import {WidgetGridItem} from './widget-grid-item.model';
import { Role } from './role.model';

export interface UserDashboard {

    default: boolean;
    description?: string; //TODO: Make it required
    docId?: string;
    gridItems: Array<WidgetGridItem>;
    isTemplate: boolean;
    modified?: boolean;
    templateId?: string;
    templateRole?: string;
    title?: string; //TODO: Make it required
    type?: string;
    userId?: string;

}

export namespace UserDashboard{
    export function createDefaultDashboard(userId: string): UserDashboard{
        return {
            type: 'UserDashboard',
            title: 'New Dashboard',
            description: '',
            isTemplate: false,
            userId: userId,
            gridItems: [],
            default: false
        }
    }
}

export interface DashboardTemplateGridChanges{
    addedGridItems?: Array<WidgetGridItem>,
    updatedGridItems?: Array<WidgetGridItem>,
    removedGridItems?: Array<WidgetGridItem>
}