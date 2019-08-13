import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {FormElementsModule} from '../form-elements/form-elements.module';
import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ChartModule} from 'angular-highcharts';

import { MainComponent } from './main/main.component';
import { SenderComponent } from './sender/sender.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SendFormComponent } from './send-form/send-form.component';
import { RolePickerComponent } from './role-picker/role-picker.component';
import { UserPickerComponent } from './user-picker/user-picker.component';
import { TrafficChartComponent } from './traffic-chart/traffic-chart.component';
import { TotalNotificationsTableComponent } from './total-notifications-table/total-notifications-table.component';

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
    StatisticsComponent, SendFormComponent, RolePickerComponent, UserPickerComponent, TrafficChartComponent, TotalNotificationsTableComponent
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
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ChartModule
  ]
})
export class NotificationManagerModule { }
