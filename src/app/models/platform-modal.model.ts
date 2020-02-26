import { PlatformFormField } from "./platform-form-field.model";

export enum PlatformModalType {
  PRIMARY = "pf-modal-primary",
  SECONDARY = "pf-modal-secondary"
}

export interface PlatformModalModel {
  type?: PlatformModalType;
  title: string;
  subtitle?: string;
  submitButtonTitle?: string;
  submitButtonClass?: string;
  submitButtonIcon?: string;
  formFields: PlatformFormField[];
}
