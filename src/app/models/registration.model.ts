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
    forms: Array<RegistrationForm>;
}

export interface RegistrationForm {
    formId: string;
}