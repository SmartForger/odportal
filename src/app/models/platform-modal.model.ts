import { PlatformFormField } from "./platform-form-field.model";
import { pick } from "lodash";
import { filter } from "rxjs/operators";

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
  formFields: PlatformFormField[];
}
