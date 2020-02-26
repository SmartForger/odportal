import { KeyValue } from "./key-value.model";
import { ValidatorFn } from '@angular/forms';

export interface PlatformFormField {
    classList?: string;
    defaultValue: string | number | boolean;
    fullWidth?: boolean;
    label?: string;
    name?: string;
    options?: KeyValue[];
    type: string;
    validators?: ValidatorFn[];
}
