import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisplayElementsModule } from '../display-elements/display-elements.module';

import { CommentsComponent } from './comments/comments.component';
import { DescriptorComponent } from './descriptor/descriptor.component';
import { WidgetsComponent } from './widgets/widgets.component';

import { MaterialModule } from '../../material.module';

@NgModule({
  declarations: [
    CommentsComponent, 
    DescriptorComponent, 
    WidgetsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    DisplayElementsModule
  ],
  exports: [
    CommentsComponent,
    DescriptorComponent,
    WidgetsComponent
  ]
})
export class AppInfoModule { }
