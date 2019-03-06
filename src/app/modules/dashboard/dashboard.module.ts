import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { RouterModule, Routes } from '@angular/router';
import {ListFiltersModule} from '../list-filters/list-filters.module';
import {CustomPipesModule} from '../custom-pipes/custom-pipes.module';
import {FormElementsModule} from '../form-elements/form-elements.module';
import {InputElementsModule} from '../input-elements/input-elements.module';
import {GridsterModule} from 'angular-gridster2';

import { MainComponent } from './main/main.component';
import { WidgetCardComponent } from './widget-card/widget-card.component';
import { AppRenderersModule } from '../app-renderers/app-renderers.module';
import { DashboardDetailsModalComponent } from './dashboard-details-modal/dashboard-details-modal.component'

const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent
  }
];

@NgModule({
  declarations: [
    MainComponent,
    WidgetCardComponent,
    DashboardDetailsModalComponent
  ],

  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DisplayElementsModule,
    ListFiltersModule,
    CustomPipesModule,
    FormElementsModule,
    InputElementsModule,
    GridsterModule,
    AppRenderersModule,
    RouterModule.forChild(ROUTES)
  ],
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class DashboardModule { }
