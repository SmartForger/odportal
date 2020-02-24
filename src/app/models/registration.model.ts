import { ApplicantColumn } from "./applicant-table.models";

export interface Registration{
    autoapprove?: boolean;
    default: boolean;
    docId: string;
    isLinear: boolean;
    overview: Array<RegistrationOverview>;
    roleNames?: Array<string>;
    steps: Array<RegistrationStep>;
    title: string;
    type?: string;
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