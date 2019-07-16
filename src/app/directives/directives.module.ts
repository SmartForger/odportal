import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisallowSpacesDirective } from './disallow-spaces.directive';
import { SpecialCharacterWhitelistDirective } from './special-character-whitelist.directive';
import { DigitsOnlyDirective } from './digits-only.directive';
import { MaxLengthDirective } from './max-length.directive';

@NgModule({
  declarations: [
    DisallowSpacesDirective,
    SpecialCharacterWhitelistDirective,
    DigitsOnlyDirective,
    MaxLengthDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DisallowSpacesDirective,
    SpecialCharacterWhitelistDirective,
    DigitsOnlyDirective,
    MaxLengthDirective
  ]
})
export class DirectivesModule { }
