import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';

import { PageTitleComponent } from './page-title/page-title.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [PageTitleComponent, ModalComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PageTitleComponent,
    ModalComponent
  ]
})
export class DisplayElementsModule { }
