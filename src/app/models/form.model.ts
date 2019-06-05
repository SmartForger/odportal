
export interface Form{
    docId: string;
    type: string;
    title: string;
    createdAt: string;
    layout: {
        rows: Array<RegistrationRow>;
    }
    status?: string;
};

export interface RegistrationRow{
    width: number;
    height: number;
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
    trigger: string;
    triggerType: string;
    status?: string;
    dateSent?: string;
    dateComplete?: string;
    binding?: string; 
}