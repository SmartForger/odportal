export interface Registration{
    docId: string;
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
    forms: Array<{formId: string}>;
}