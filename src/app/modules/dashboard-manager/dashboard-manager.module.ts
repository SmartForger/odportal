import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatIconModule, MatListModule, MatSelectModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { GridsterModule } from 'angular-gridster2';
import { AppRenderersModule } from '../app-renderers/app-renderers.module';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { FormElementsModule } from '../form-elements/form-elements.module';

import { DashboardManagerComponent } from './dashboard-manager/dashboard-manager.component';
import { DashboardPreviewComponent } from './dashboard-preview/dashboard-preview.component';
import { WidgetRendererComponent } from '../app-renderers/widget-renderer/widget-renderer.component';
import { CreateTemplateModalComponent } from './create-template-modal/create-template-modal.component';

const ROUTES: Routes = [
    {
      path: '',
      component: DashboardManagerComponent
    }
  ];

@NgModule({
  declarations: [DashboardManagerComponent, DashboardPreviewComponent, CreateTemplateModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    GridsterModule,
    AppRenderersModule,
    DisplayElementsModule,
    FormElementsModule
  ],
  entryComponents: [
      CreateTemplateModalComponent,
      WidgetRendererComponent
  ]
})
export class DashboardManagerModule { }
