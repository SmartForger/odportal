import { Form } from './form.model';
import {RegistrationOverview} from './registration.model';

export interface UserRegistration{
    docId: string;
    status: RegistrationStatus;
    userId: string;
    bindingRegistry: Object;
    overview: Array<RegistrationOverview>;
    steps: Array<UserRegistrationStep>;
}

export interface UserRegistrationStep{
    title: string;
    description: string;
    status: StepStatus,
    forms: Array<Form>;
}

export enum StepStatus {

    Incomplete = "incomplete",
    Inprogress = "inprogress",
    Complete = "complete"

}

export enum RegistrationStatus {

    Incomplete = "incomplete",
    Inprogress = "inprogress",
    Complete = "complete"

}