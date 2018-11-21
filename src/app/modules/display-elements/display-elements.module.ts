import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';

import { PageTitleComponent } from './page-title/page-title.component';

@NgModule({
  declarations: [PageTitleComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PageTitleComponent
  ]
})
export class DisplayElementsModule { }
