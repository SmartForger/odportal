import * as multer from 'multer'; //Imported for side effects.

export interface Form {
  allowPhysicalUpload?: boolean;
  approvalContactsSubmitted?: boolean;
  blankForm?: Express.Multer.File;
  createdAt: string;
  dateCompleted?: string;
  dateSubmitted?: string;
  docId: string;
  files?: Array<UploadedFile>;
  layout: {
    sections: Array<RegistrationSection>;
  };
  manualWorkflowRequested?: boolean;
  pdf?: string;
  physicalForm?: Express.Multer.File;
  printableForm?: UploadedFile;
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
  invalid?: any;
  label?: string;
  preserveBinding?: boolean;
  type: string;
  uid?: string;
  value?: any;
}

export interface FormTrigger {
  config: any;
  on: FormStatus;
  triggerType: TriggerType;
}

export type UserProfileTriggerConfig = Array<UserProfileTriggerConfigObj>;

export interface UserProfileTriggerConfigObj{
  binding: string;
  datafield: 'alternateEmail' | 'email';
}

export interface UserProfileExtensionTriggerConfig{
  endpoint: string;
  secret?: string;
}

export interface UploadedFile {
  createdAt: string;
  fileName: string;
  mimetype: string;
  originalName: string;
  size: number;
}

export interface Autofill {
  type: AutoFillType;
  value: string;
}

export interface Approval {
  applicantDefined: boolean;
  approverId?: string;
  dateCompleted?: string;
  email?: string;
  lastContacted?: string;
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
  Missing = 'missing',
  Incomplete = 'incomplete',
  Complete = 'complete'
}

export enum SectionStatus {
  Incomplete = 'incomplete',
  Complete = 'complete'
}

export enum TriggerType {
  UserProfile = 'user-profile',
  UserProfileExtension = 'user-profile-extension'
}
