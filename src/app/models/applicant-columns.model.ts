export interface ApplicantColumn {
    attributes?: any;
    binding: string;
    bindingType: ApplicantBindingType;
    columnGroup: ApplicantColumnGroup;
    title: string;
    values?: Array<any>;
}

export enum ApplicantBindingType{
    TEXT = 0, 
    BOOLEAN, 
    RADIO, 
    LIST, 
    ENUM, 
    PROGRESS, 
    ICON, 
    VERIFICATION
}

export enum ApplicantColumnGroup{
    BINDING,
    PROCESS,
    USER,
    VERIFICATION
}