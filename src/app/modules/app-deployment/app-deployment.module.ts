import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { RouterModule, Routes } from '@angular/router';
import {ListFiltersModule} from '../list-filters/list-filters.module';
import {CustomPipesModule} from '../custom-pipes/custom-pipes.module';
import {FormElementsModule} from '../form-elements/form-elements.module';
import {InputElementsModule} from '../input-elements/input-elements.module';

import { MainComponent } from './main/main.component';
import { ListAppsComponent } from './list-apps/list-apps.component';
import { ListAppsActiveComponent } from './list-apps-active/list-apps-active.component';
import { ListAppsPendingComponent } from './list-apps-pending/list-apps-pending.component';
import { CreateAppFormComponent } from './create-app-form/create-app-form.component';
import { EditAppMainComponent } from './edit-app-main/edit-app-main.component';
import { EditAppClientRolesComponent } from './edit-app-client-roles/edit-app-client-roles.component';
import { EditAppRoleMappingsComponent } from './edit-app-role-mappings/edit-app-role-mappings.component';
import { EditAppCommentsComponent } from './edit-app-comments/edit-app-comments.component';
import { ViewAppInfoComponent } from './view-app-info/view-app-info.component';
import { ViewWidgetsComponent } from './view-widgets/view-widgets.component';


const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'list',
        component: ListAppsComponent
      },
      {
        path: 'edit/:id',
        component: EditAppMainComponent
      },

      {
        path: '',
        redirectTo: 'list'
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
    EditAppClientRolesComponent, 
    EditAppRoleMappingsComponent, 
    EditAppCommentsComponent, ViewAppInfoComponent, ViewWidgetsComponent],


  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DisplayElementsModule,
    ListFiltersModule,
    CustomPipesModule,
    FormElementsModule,
    InputElementsModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class AppDeploymentModule { }
