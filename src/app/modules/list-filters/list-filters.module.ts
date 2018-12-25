import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

import { BasicStringFilterComponent } from './basic-string-filter/basic-string-filter.component';

@NgModule({
  declarations: [
    BasicStringFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    BasicStringFilterComponent
  ]
})
export class ListFiltersModule { }
