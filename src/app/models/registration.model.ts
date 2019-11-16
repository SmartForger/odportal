import { ApplicantColumn } from "./applicant-columns.model";

export interface Registration{
    docId: string;
    type?: string;
    title: string;
    isLinear: boolean;
    default: boolean;
    overview: Array<RegistrationOverview>;
    steps: Array<RegistrationStep>;
}

export interface RegistrationOverview{
    title: string;
    content: string;
}

export interface RegistrationStep{
    title: string;
    description: string;
    forms: Array<FormIdentifier>;
}

export interface FormIdentifier {
    formId: string;
}

export interface RegistrationSummaryFields{
    bindings: Array<ApplicantColumn>;
    verifiers: Array<ApplicantColumn>;
}