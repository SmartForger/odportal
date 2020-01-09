import { KeyValue } from "./key-value.model";
import { ValidatorFn } from '@angular/forms';

export interface PlatformFormField {
    type: string;
    name?: string;
    label: string;
    defaultValue: string | number;
    validators?: ValidatorFn[];
    fullWidth?: boolean;
    options?: KeyValue[];
}