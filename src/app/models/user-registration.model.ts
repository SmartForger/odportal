import { Form } from './form.model';
import {RegistrationOverview} from './registration.model';
import { UserProfile } from './user-profile.model';

export interface UserRegistration{
    approvalStatus: RegistrationApprovalStatus;
    bindingRegistry: Object;
    createdAt: string;
    dateCompleted?: string;
    dateSubmitted?: string;
    docId: string;
    overview: Array<RegistrationOverview>;
    progress: number;
    registrationId: string;
    status: RegistrationStatus;
    steps: Array<UserRegistrationStep>;
    userProfile: UserProfile;
}

export interface UserRegistrationStep{
    dateCompleted?: string;
    description: string;
    forms: Array<Form>;
    status: StepStatus;
    title: string;
}

export interface BindingInitializations{
    binding: string;
    readonly?: boolean;
    value?: boolean;
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

export enum RegistrationApprovalStatus{

    Approved = "approved",
    Pending = "pending"

}