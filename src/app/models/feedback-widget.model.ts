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
    parentAppId: string;

}

export interface AverageRating {

    widgetId: string;
    parentAppId: string;
    rating: number;
    totalRatings: number;

}