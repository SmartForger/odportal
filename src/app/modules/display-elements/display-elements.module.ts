import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormElementsModule} from '../form-elements/form-elements.module';
import { MaterialModule } from '../../material.module';
import { PageTitleComponent } from './page-title/page-title.component';
import { ModalComponent } from './modal/modal.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { CardTitleComponent } from './card-title/card-title.component';

@NgModule({
  declarations: [
    PageTitleComponent, 
    ModalComponent, TopNavComponent, 
    CardTitleComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormElementsModule,
    MaterialModule
  ],
  exports: [
    PageTitleComponent,
    ModalComponent,
    TopNavComponent,
    CardTitleComponent
  ]
})
export class DisplayElementsModule { }
