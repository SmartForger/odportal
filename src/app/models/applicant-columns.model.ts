export interface ApplicantColumn {
    attributes?: any;
    binding: string;
    bindingType: ApplicantBindingType;
    columnGroup: ApplicantColumnGroup;
    title: string;
    values?: Array<any>;
}

export interface ApplicantColumnAttributes {
    approvalLocation: {
        stepIndex: number;
        formIndex: number;
        sectionIndex: number;
    };
    color?: string;
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
    BINDING = 0,
    PROCESS,
    USER,
    VERIFICATION
}