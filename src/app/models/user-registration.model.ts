import { Form } from './form.model';
import {RegistrationOverview} from './registration.model';
import { UserProfile } from './user-profile.model';

export interface UserRegistration{
    docId: string;
    status: RegistrationStatus;
    userProfile: UserProfile;
    createdAt: string;
    registrationId: string;
    bindingRegistry: Object;
    overview: Array<RegistrationOverview>;
    steps: Array<UserRegistrationStep>;
    dateCompleted?: string;
}

export interface UserRegistrationStep{
    title: string;
    description: string;
    status: StepStatus;
    forms: Array<Form>;
    dateCompleted?: string;
}

export enum StepStatus {

    Incomplete = "incomplete",
    Inprogress = 'inprogress',
    Submitted = 'submitted',
    Complete = "complete"

}

export enum RegistrationStatus {

    Incomplete = "incomplete",
    Inprogress = "inprogress",
    Submitted = 'submitted',
    Complete = "complete"

}