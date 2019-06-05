import { Form } from './form.model';

export interface UserRegistration{
    docId: string;
    status: string;
    userId: string;
    bindingRegistry: any;
    progress: Array<UserRegistrationStep>;
}

export interface UserRegistrationStep{
    title: string;
    forms: Array<Form>;
}