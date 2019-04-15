import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router'; 
import {DisplayElementsModule} from '../display-elements/display-elements.module';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

import { MainComponent } from './main/main.component';
import { ListPageAveragesComponent } from './list-page-averages/list-page-averages.component';
import { ListPageFeedbackComponent } from './list-page-feedback/list-page-feedback.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'pages',
        component: ListPageAveragesComponent
      },
      {
        path: 'pages/:group',
        component: ListPageFeedbackComponent
      },
      {
        path: '',
        redirectTo: 'pages'
      }
    ]
  }
];

@NgModule({
  declarations: [
    MainComponent, 
    ListPageAveragesComponent, 
    ListPageFeedbackComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    DisplayElementsModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class FeedbackManagerModule { }
