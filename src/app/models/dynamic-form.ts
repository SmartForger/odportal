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
  width: number;
  height: number;
  columns: {
    fields: Array<DynamicFormField>;
  };
}

export interface DynamicFormField {
  type: string; // text | textarea | checkbox | select | radio | signature | file
  label: string;
  defaultValue?: string | number;
  binding: string;
  attributes?:
    | DFF_CheckboxAttr
    | DFF_RadioAttr
    | DFF_SelectAttr
    | DFF_SignatureAttr
    | DFF_TextAttr;
}

export interface DFF_TextAttr {
  maxlength: number;
  minlength: number;
  placeholder: string;
}

export interface DFF_RadioAttr {
  options: Array<KeyValue>;
  default: string;
}

export interface DFF_CheckboxAttr {
  default: boolean;
}

export interface DFF_SelectAttr {
  options: Array<KeyValue>;
}

export interface DFF_SignatureAttr {
  width: number;
  height: number;
}
