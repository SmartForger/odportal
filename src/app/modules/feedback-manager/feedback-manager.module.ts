import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router'; 
import {DisplayElementsModule} from '../display-elements/display-elements.module';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MaterialModule} from '../../material.module';
import {MatSortModule} from '@angular/material';

import {BarRatingModule} from 'ngx-bar-rating';;
import {FormsModule} from '@angular/forms';

import { MainComponent } from './main/main.component';
import { ListPageAveragesComponent } from './list-page-averages/list-page-averages.component';
import { ListPageFeedbackComponent } from './list-page-feedback/list-page-feedback.component';
import { FeedbackTypesComponent } from './feedback-types/feedback-types.component';
import { ListWidgetAveragesComponent } from './list-widget-averages/list-widget-averages.component';
import { ListWidgetFeedbackComponent } from './list-widget-feedback/list-widget-feedback.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'feedback-types',
        component: FeedbackTypesComponent
      },
      {
        path: 'feedback-types/pages',
        component: ListPageAveragesComponent
      },
      {
        path: 'feedback-types/pages/:group',
        component: ListPageFeedbackComponent
      },
      {
        path: 'feedback-types/widget/:appId/:widgetId',
        component: ListWidgetFeedbackComponent
      },
      {
        path: '',
        redirectTo: 'feedback-types'
      }
    ]
  }
];

@NgModule({
  declarations: [
    MainComponent, 
    ListPageAveragesComponent, 
    ListPageFeedbackComponent, 
    FeedbackTypesComponent, 
    ListWidgetAveragesComponent, ListWidgetFeedbackComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    DisplayElementsModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MaterialModule,
    BarRatingModule,
    FormsModule,
    MatSortModule
  ]
})
export class FeedbackManagerModule { }
