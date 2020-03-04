import {AbstractControl, ValidatorFn, FormControl} from '@angular/forms';

export function confirmationMatchValidator(otherControl: FormControl): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        return control.value !== otherControl.value ? {'confirmationMatch': {value: control.value}} : null;
    };
}