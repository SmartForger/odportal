import { ApplicantColumn } from "./applicant-table.models";

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
    applicantResponses: Array<ApplicantColumn>;
    approverResponses: Array<ApplicantColumn>;
    verifiers: Array<ApplicantColumn>;
}