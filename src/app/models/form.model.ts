
export interface Form{
    docId: string;
    type: string;
    title: string;
    createdAt: string;
    layout: {
        rows: Array<RegistrationRow>;
    }
    status?: FormStatus;
    pdf?: string;
    dateSubmitted?: string;
    dateCompleted?: string;
    files: Array<UploadedFile>;
};

export interface RegistrationRow{
    columns: Array<RegistrationColumn>;
}

export interface RegistrationColumn{
    fields: Array<FormField>;
    triggers: Array<FormTrigger>;
}

export interface FormField{
    type: string;
    label: string;
    attributes: any;
    binding: string;
    value?: any;
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

export enum FormStatus {

    Incomplete = "incomplete",
    Submitted = "submitted",
    Complete = "complete"

}