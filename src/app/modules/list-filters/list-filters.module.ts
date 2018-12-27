import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

import { BasicStringFilterComponent } from './basic-string-filter/basic-string-filter.component';
import { StringWithDropdownFilterComponent } from './string-with-dropdown-filter/string-with-dropdown-filter.component';

@NgModule({
  declarations: [
    BasicStringFilterComponent,
    StringWithDropdownFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    BasicStringFilterComponent,
    StringWithDropdownFilterComponent
  ]
})
export class ListFiltersModule { }
