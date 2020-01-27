export interface Form {
  createdAt: string;
  dateCompleted?: string;
  dateSubmitted?: string;
  docId: string;
  files?: Array<UploadedFile>;
  layout: {
    sections: Array<RegistrationSection>;
  };
  pdf?: string;
  status?: FormStatus;
  title: string;
  triggers?: Array<FormTrigger>;
}

export interface RegistrationSection{
  approval?: Approval;
  hidden?: boolean;
  rows: Array<RegistrationRow>;
  status: SectionStatus;
  title: string;
}

export interface RegistrationRow {
  columns: Array<RegistrationColumn>;
}

export interface RegistrationColumn {
  field: FormField;
}

export interface FormField {
  attributes: any;
  autofill?: Autofill;
  binding?: string;
  label?: string;
  preserveBinding?: boolean;
  type: string;
  value?: any;
}

export interface FormTrigger {
  config: any;
  on: FormStatus;
  triggerType: TriggerType;
}

export interface EmailFormTriggerConfig{
  binding: string;
  emailContent: string;
  emailContentType: string;
}

export interface ValidateFormTriggerConfig{
  endpoint: string;
  secret?: string;
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
  applicantDefined: boolean;
  dateCompleted?: string;
  email?: string;
  regex?: string;
  roles?: Array<string>;
  status?: ApprovalStatus;
  title: string;
  userId?: string;
}

export interface ApproverContact {
  email: string;
  section: string;
}

export enum AutoFillType {
  Bind = 'bind',
  Static = 'static',
  Date = 'date'
}

export enum FormStatus {
  Incomplete = 'incomplete',
  Inprogress = 'inprogress',
  Submitted = 'submitted',
  Complete = 'complete'
}

export enum ApprovalStatus {
  Incomplete = 'incomplete',
  Complete = 'complete'
}

export enum SectionStatus {
  Incomplete = 'incomplete',
  Complete = 'complete'
}

export enum TriggerType {
  Email = 'email',
  Validate = 'validate'
}
