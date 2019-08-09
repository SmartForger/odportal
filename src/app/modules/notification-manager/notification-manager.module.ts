import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {FormElementsModule} from '../form-elements/form-elements.module';
import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';

import { MainComponent } from './main/main.component';
import { SenderComponent } from './sender/sender.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SendFormComponent } from './send-form/send-form.component';

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
    StatisticsComponent, SendFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES),
    FormElementsModule,
    MatTabsModule,
    MatGridListModule,
    MatListModule
  ]
})
export class NotificationManagerModule { }
