import { UserProfile } from './user-profile.model';

export interface WidgetFeedback {

    docId?: string;
    type?: string;
    user: UserProfile;
    dateCreated?: string;
    rating: number;
    comment?: string;
    screenshot?: string;
    anonymous: boolean;
    widgetId: string;
    widgetTitle: string;
    parentAppId: string;

}

export interface WidgetGroupAvgRating {

    widgetId: string;
    widgetTitle: string;
    rating: number;
    totalRatings: number;

}