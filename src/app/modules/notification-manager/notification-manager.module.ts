import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {FormElementsModule} from '../form-elements/form-elements.module';
import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { MainComponent } from './main/main.component';
import { SenderComponent } from './sender/sender.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SendFormComponent } from './send-form/send-form.component';
import { RolePickerComponent } from './role-picker/role-picker.component';
import { UserPickerComponent } from './user-picker/user-picker.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent
  }
];

@NgModule({
  declarations: [
    MainComponent, 
    SenderComponent, 
    StatisticsComponent, SendFormComponent, RolePickerComponent, UserPickerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES),
    FormElementsModule,
    MatTabsModule,
    MatGridListModule,
    MatListModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule
  ]
})
export class NotificationManagerModule { }
