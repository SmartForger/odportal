import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { RouterModule, Routes } from '@angular/router';
import { ListFiltersModule } from '../list-filters/list-filters.module';
import { CustomPipesModule } from '../custom-pipes/custom-pipes.module';
import { FormElementsModule } from '../form-elements/form-elements.module';
import { InputElementsModule } from '../input-elements/input-elements.module';
import { GridsterModule } from 'angular-gridster2';

import { MainComponent } from './main/main.component';
import { AppRenderersModule } from '../app-renderers/app-renderers.module';
import { DashboardOptionsComponent } from './dashboard-options/dashboard-options.component';
import { DashboardGridsterComponent } from './dashboard-gridster/dashboard-gridster.component';

import { MaterialModule } from '../../material.module';
import { ConfirmModalComponent } from '../display-elements/confirm-modal/confirm-modal.component';
import { WidgetRendererComponent } from '../app-renderers/widget-renderer/widget-renderer.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent
  }
];

@NgModule({
  declarations: [
    MainComponent,
    DashboardOptionsComponent,
    DashboardGridsterComponent
  ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DisplayElementsModule,
    ListFiltersModule,
    CustomPipesModule,
    FormElementsModule,
    InputElementsModule,
    GridsterModule,
    MaterialModule,
    AppRenderersModule,
    RouterModule.forChild(ROUTES)
  ],
  exports: [
    MainComponent,
    DashboardOptionsComponent,
    DashboardGridsterComponent
  ],
  entryComponents: [
    ConfirmModalComponent, 
    WidgetRendererComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]

})
export class DashboardModule { }
