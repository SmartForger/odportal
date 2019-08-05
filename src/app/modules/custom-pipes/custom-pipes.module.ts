import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StringFilterPipe } from './string-filter.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { UtcDatePipe } from './utc-date.pipe';
import { DatePipe } from '@angular/common';
import { ObjectFilterPipe } from './object-filter.pipe';

@NgModule({
  providers: [
    DatePipe
  ],
  declarations: [
    StringFilterPipe,
    SafeHtmlPipe,
    UtcDatePipe,
    ObjectFilterPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StringFilterPipe,
    SafeHtmlPipe,
    UtcDatePipe,
    ObjectFilterPipe
  ]
})
export class CustomPipesModule { }
