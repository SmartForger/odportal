export interface ApplicantColumn {
    binding: string;
    bindingType: ApplicantBindingType;
    columnGroup: ApplicantColumnGroup;
    title: string;
}

export enum ApplicantBindingType{
    TEXT = 0, BOOLEAN, RADIO, LIST, ENUM, PROGRESS, ICON
}

export enum ApplicantColumnGroup{
    BINDING,
    PROCESS,
    USER,
    VERIFICATION
}