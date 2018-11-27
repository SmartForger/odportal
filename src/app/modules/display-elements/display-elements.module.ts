import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';

import { PageTitleComponent } from './page-title/page-title.component';
import { ModalComponent } from './modal/modal.component';
import { CardTitleComponent } from './card-title/card-title.component';
import { TopNavComponent } from './top-nav/top-nav.component';

@NgModule({
  declarations: [PageTitleComponent, ModalComponent,CardTitleComponent,TopNavComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PageTitleComponent,
    ModalComponent,
    CardTitleComponent,
    TopNavComponent
  ]
})
export class DisplayElementsModule { }
