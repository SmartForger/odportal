import {WidgetGridItem} from './widget-grid-item.model';
import { Role } from './role.model';

export interface UserDashboard {

    default: boolean;
    description?: string; //TODO: Make it required
    docId?: string;
    gridItems: Array<WidgetGridItem>;
    isTemplate: boolean;
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