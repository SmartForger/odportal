import { Component, OnInit, Input } from '@angular/core';
import { PasswordRequirements } from '../../../models/password-requirements.model';

@Component({
  selector: 'app-password-strength-indicator',
  templateUrl: './password-strength-indicator.component.html',
  styleUrls: ['./password-strength-indicator.component.scss']
})
export class PasswordStrengthIndicatorComponent implements OnInit {

  minLengthCheck: boolean;
  uppersCheck: boolean;
  lowersCheck: boolean;
  numbersCheck: boolean;
  specialsCheck: boolean;

  private _password: string;
  @Input('password')
  get password(): string {
    return this._password;
  }
  set password(p: string) {
    this._password = p;
    this.checkPassword();
  }

  @Input() requirements: PasswordRequirements;

  constructor() {
    this.resetChecks();
  }

  ngOnInit() {
  }

  private checkPassword(): void {
    if (this.password && this.password.length) {
      this.minLengthCheck = (this.password.length >= this.requirements.minLength);
      let uppers: number = 0;
      let lowers: number = 0;
      let specials: number = 0;
      let numbers: number = 0;
      for (let char: number = 0; char < this.password.length; ++char) {
        if (this.password.charAt(char).match('[A-Z]')) {
          ++uppers;
        }
        else if (this.password.charAt(char).match('[a-z]')) {
          ++lowers;
        }
        else if (this.password.charAt(char).match('[0-9]')) {
          ++numbers;
        }
        else {
          ++specials;
        }
      }
      this.uppersCheck = (uppers >= this.requirements.uppers);
      this.lowersCheck = (lowers >= this.requirements.lowers);
      this.specialsCheck = (specials >= this.requirements.specials);
      this.numbersCheck = (numbers >= this.requirements.numbers);
    }
    else {
      this.resetChecks();
    }
  }

  private resetChecks(): void {
    this.minLengthCheck = false;
    this.uppersCheck = false;
    this.lowersCheck = false;
    this.numbersCheck = false;
    this.specialsCheck = false;
  }

}
