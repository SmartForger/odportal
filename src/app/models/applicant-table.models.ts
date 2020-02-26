export interface ApplicantColumn {
    attributes?: any;
    binding: string;
    bindingType: ApplicantBindingType;
    columnGroup: ApplicantColumnGroup;
    registrationIds?: Array<string>;
    title: string;
    values?: Array<any>;
}

export interface ApplicantColumnAttributes {
    approvalLocation?: {
        stepIndex: number;
        formIndex: number;
        sectionIndex: number;
    };
    color?: string;
    listKeys?: Array<string>;
}

export interface ApplicantTableMemory {
    columns: Array<ApplicantColumn>;
    columnsDef: Array<string>;
    headerColumnsDef: Array<string>;
    pageTotal: number;
    registrationColumnCount: number;
    rows: Array<Object>;
    userColumnCount: number;
    verificationColumnCount: number;
}

export interface PagedApplicantColumnResult {
    results: Array<ApplicantColumn>;
    total?: number;
}

export interface ApplicantTableOptions {
    countTotal?: boolean;
    filters?: Array<ApplicantTableFilter>;
    orderBy?: string;
    orderByDirection?: string;
    orderByType?: ApplicantColumnGroup;
    orderSubkey?: string;
    page?: number;
    perPage?: number;
    showClosed?: boolean;
    verifierEmails?: Array<string>;
}

export interface ApplicantTableSettings{
    app: string;
    docId: string;
    regId: string;
    showClosed: boolean;
    type: 'table-settings';
    userId: string;
}

export interface ApplicantTableFilter{
    allowEmpty: boolean;
    allowNonEmpty: boolean;
    column: ApplicantColumn;
    value: string;
}

export enum ApplicantBindingType{
    TEXT = 0, 
    BOOLEAN, 
    RADIO, 
    LIST, 
    ENUM, 
    PROGRESS, 
    ICON, 
    VERIFICATION,
    DATE
}

export enum ApplicantColumnGroup{
    APPLICANT_RESPONSE = 0,
    REGISTRATION_DETAIL,
    USER_PROFILE,
    VERIFICATION,
    APPROVER_RESPONSE
}