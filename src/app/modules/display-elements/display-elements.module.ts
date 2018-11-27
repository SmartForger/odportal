import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';

import { PageTitleComponent } from './page-title/page-title.component';
import { ModalComponent } from './modal/modal.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { CardTitleComponent } from './card-title/card-title.component';
import { FilterComponent } from './filter/filter.component';

@NgModule({
  declarations: [PageTitleComponent, ModalComponent, TopNavComponent, CardTitleComponent, FilterComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PageTitleComponent,
    ModalComponent,
    TopNavComponent,
    CardTitleComponent,
    FilterComponent,
  ]
})
export class DisplayElementsModule { }
