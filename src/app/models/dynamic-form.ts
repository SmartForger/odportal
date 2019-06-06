import { KeyValue } from './key-value.model';

export interface DynamicForm {
  docId: string;
  type: string;
  title: string;
  createdAt: Date;
  layout: {
    rows: Array<DynamicFormRow>;
  };
}

export interface DynamicFormRow {
  columns: Array<{
    field: DynamicFormField;
  }>;
}

export interface DynamicFormField {
  type: string; // text | textarea | checkbox | select | radio | signature | file
  label?: string;
  defaultValue?: string | number;
  binding?: string;
  preserveBinding?: boolean;
  attributes?: DFF_Attribute;
  autofill?: any;
}

export interface DFF_Attribute {
  required?: boolean;
  maxlength?: number;
  minlength?: number;
  placeholder?: string;
  options?: Array<KeyValue>;
  default?: number | boolean;
  description?: string;
  display?: string;
  value?: string;
}
