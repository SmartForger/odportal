export interface Form {
  docId: string;
  title: string;
  createdAt: string;
  layout: {
    sections: Array<RegistrationSection>;
  };
  status?: FormStatus;
  pdf?: string;
  dateSubmitted?: string;
  dateCompleted?: string;
  files?: Array<UploadedFile>;
  triggers?: Array<FormTrigger>;
}

export interface RegistrationSection{
  title: string;
  hidden?: boolean;
  approval?: Approval;
  rows: Array<RegistrationRow>;
}

export interface RegistrationRow {
  columns: Array<RegistrationColumn>;
}

export interface RegistrationColumn {
  field: FormField;
}

export interface FormField {
  type: string;
  label?: string;
  attributes: any;
  binding?: string;
  value?: any;
  autofill?: Autofill;
  preserveBinding?: boolean;
}

export interface FormTrigger {
  triggerType: string;
  binding?: string;
  emailContent?: string;
  emailContentType?: string;
}

export interface UploadedFile {
  originalName: string;
  fileName: string;
  createdAt: string;
  size: number;
}

export interface Autofill {
  type: AutoFillType;
  value: string;
}

export interface Approval {
  title: string;
  email?: string;
  applicantDefined: boolean;
  roles?: Array<string>;
  status?: ApprovalStatus;
  dateCompleted?: string;
  userId?: string;
}

export interface ApproverContact {
  section: string;
  email: string;
}

export enum AutoFillType {
  Bind = 'bind',
  Static = 'static',
  Date = 'date'
}

export enum FormStatus {
  Incomplete = 'incomplete',
  Submitted = 'submitted',
  Complete = 'complete'
}

export enum ApprovalStatus {
  Incomplete = 'incomplete',
  Complete = 'complete'
}