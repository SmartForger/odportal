import {UserProfile} from './user-profile.model';

export interface Feedback {

    docId?: string;
    type?: string;
    user: UserProfile;
    dateCreated?: string;
    pageGroup: string;
    url: string;
    rating: number;
    comment?: string;
    screenshot?: string;
    anonymous: boolean;

}

export interface FeedbackPageGroupAvg {

    rating: number;
    pageGroup: string;
    totalRatings: number;

}