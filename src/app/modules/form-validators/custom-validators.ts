import {AbstractControl, ValidatorFn} from '@angular/forms';
import {PasswordRequirements} from '../../models/password-requirements.model';


export function passwordRequirementsValidator(requirements: PasswordRequirements): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      let invalid: boolean = true;
      let pass: string = control.value;
      if (pass.length >= requirements.minLength) {
        let char: number = 0;

        let uppers: number = 0;
        let lowers: number = 0;
        let specials: number = 0;
        let numbers: number = 0;

        while(invalid && char < pass.length){
          if(pass.charAt(char).match('[A-Z]')){
            ++uppers;
          }
          else if(pass.charAt(char).match('[a-z]')){
            ++lowers;
          }
          else if(pass.charAt(char).match('[0-9]')){
            ++numbers;
          }
          else{
            ++specials;
          }

          invalid = (uppers < requirements.uppers || lowers < requirements.lowers || numbers < requirements.numbers || specials < requirements.specials);

          ++char;
        }
      }
      return invalid ? {'passwordRequirements': {value: control.value}} : null;
    };
}