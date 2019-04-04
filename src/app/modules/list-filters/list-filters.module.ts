import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {InputElementsModule} from '../input-elements/input-elements.module';

import { BasicStringFilterComponent } from './basic-string-filter/basic-string-filter.component';
import { StringWithDropdownFilterComponent } from './string-with-dropdown-filter/string-with-dropdown-filter.component';

import {MaterialModule} from '../../material.module';

@NgModule({
  declarations: [
    BasicStringFilterComponent,
    StringWithDropdownFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InputElementsModule,
    MaterialModule
  ],
  exports: [
    BasicStringFilterComponent,
    StringWithDropdownFilterComponent
  ]
})
export class ListFiltersModule { }
