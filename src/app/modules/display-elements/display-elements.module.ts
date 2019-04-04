import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormElementsModule } from '../form-elements/form-elements.module';
import { MaterialModule } from '../../material.module';
import { PageTitleComponent } from './page-title/page-title.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { CardTitleComponent } from './card-title/card-title.component';
import { PermissionsModalComponent } from './permissions-modal/permissions-modal.component';
import { InputElementsModule } from '../input-elements/input-elements.module';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

@NgModule({
  declarations: [
    PageTitleComponent, 
    TopNavComponent, 
    CardTitleComponent,
    PermissionsModalComponent,
    ConfirmModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormElementsModule,
    MaterialModule,
    InputElementsModule
  ],
  exports: [
    PageTitleComponent,
    TopNavComponent,
    CardTitleComponent,
    PermissionsModalComponent
  ],
  entryComponents: [ConfirmModalComponent]
})
export class DisplayElementsModule { }
