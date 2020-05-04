import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
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
    DisplayElementsModule,
    AvatarModule
  ],
  exports: [
    CommentsComponent,
    DescriptorComponent,
    WidgetsComponent
  ]
})
export class AppInfoModule { }
