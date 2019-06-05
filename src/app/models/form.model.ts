
export interface Form{
    docId: string;
    title: string;
    createdAt: string;
    layout: {
        rows: Array<RegistrationRow>;
    }
    status?: FormStatus;
    pdf?: string;
    dateSubmitted?: string;
    dateCompleted?: string;
    files?: Array<UploadedFile>;
    approvals?: Array<Approval>;
    triggers?: Array<FormTrigger>;
};

export interface RegistrationRow{
    columns: Array<RegistrationColumn>;
}

export interface RegistrationColumn{
    field: FormField;
}

export interface FormField{
    type: string;
    label: string;
    attributes: any;
    binding: string;
    value?: any;
    autofill?: Autofill;
}

export interface FormTrigger{
    triggerType: string;
    binding?: string; 
    emailContent?: string;
    emailContentType?: string;
}

export interface UploadedFile {
    originalName: string;
    fileName: string;
    createdAt: string;
    fileSize: number;
}

export interface Autofill {

    type: AutoFillType;
    value: string;

}

export interface Approval {

    title: string;
    binding: string;
    status?: ApprovalStatus;
    approverId?: string;
    dateCompleted?: string;
    fields: Array<string>;

}

export enum AutoFillType {

    Bind = "bind",
    Static = "static",
    Date = "date"

}

export enum FormStatus {

    Incomplete = "incomplete",
    Submitted = "submitted",
    Complete = "complete"

}

export enum ApprovalStatus {

    Incomplete = "incomplete",
    Complete = "complete"

}