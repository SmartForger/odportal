import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { RouterModule, Routes } from '@angular/router';
import {ListFiltersModule} from '../list-filters/list-filters.module';
import {CustomPipesModule} from '../custom-pipes/custom-pipes.module';
import {FormElementsModule} from '../form-elements/form-elements.module';
import {InputElementsModule} from '../input-elements/input-elements.module';
import {AppInfoModule} from '../app-info/app-info.module';
import {FilePickersModule} from '../file-pickers/file-pickers.module';
import {ProgressIndicatorsModule} from '../progress-indicators/progress-indicators.module';

import { MainComponent } from './main/main.component';
import { ListAppsComponent } from './list-apps/list-apps.component';
import { ListAppsActiveComponent } from './list-apps-active/list-apps-active.component';
import { ListAppsPendingComponent } from './list-apps-pending/list-apps-pending.component';
import { CreateAppFormComponent } from './create-app-form/create-app-form.component';
import { EditAppMainComponent } from './edit-app-main/edit-app-main.component';
import { EditAppRoleMappingsComponent } from './edit-app-role-mappings/edit-app-role-mappings.component';
import { ListVendorsComponent } from './list-vendors/list-vendors.component';

import {MaterialModule} from '../../material.module';
import { ListAllAppsComponent } from './list-all-apps/list-all-apps.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'vendors',
        component: ListVendorsComponent
      },
      {
        path: 'apps/:vendorId',
        component: ListAppsComponent
      },
      {
        path: 'edit/:vendorId/:appId',
        component: EditAppMainComponent
      },
      {
        path: '',
        redirectTo: 'vendors'
      }
    ]
  }
];

@NgModule({
  declarations: [
    MainComponent, 
    ListAppsComponent, 
    ListAppsActiveComponent, 
    ListAppsPendingComponent, 
    CreateAppFormComponent, 
    EditAppMainComponent, 
    EditAppRoleMappingsComponent, 
    ListVendorsComponent, ListAllAppsComponent
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
    AppInfoModule,
    MaterialModule,
    FilePickersModule,
    ProgressIndicatorsModule,
    RouterModule.forChild(ROUTES)
  ],

  entryComponents: [CreateAppFormComponent]
})
export class AppDeploymentModule { }
