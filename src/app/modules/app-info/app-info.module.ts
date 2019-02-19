import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DisplayElementsModule} from '../display-elements/display-elements.module';

import { ClientRolesComponent } from './client-roles/client-roles.component';
import { CommentsComponent } from './comments/comments.component';
import { DescriptorComponent } from './descriptor/descriptor.component';
import { WidgetsComponent } from './widgets/widgets.component';

@NgModule({
  declarations: [
    ClientRolesComponent, 
    CommentsComponent, 
    DescriptorComponent, 
    WidgetsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DisplayElementsModule
  ],
  exports: [
    ClientRolesComponent,
    CommentsComponent,
    DescriptorComponent,
    WidgetsComponent
  ]
})
export class AppInfoModule { }
