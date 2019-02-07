import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DisplayElementsModule} from '../display-elements/display-elements.module';
import {InputElementsModule} from '../input-elements/input-elements.module';
import {FormElementsModule} from '../form-elements/form-elements.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { MainComponent } from './main/main.component';
import { ListAppsComponent } from './list-apps/list-apps.component';
import { EditAppComponent } from './edit-app/edit-app.component';
import { NativeAppInfoFormComponent } from './native-app-info-form/native-app-info-form.component';
import { RealmRoleMapperComponent } from './realm-role-mapper/realm-role-mapper.component';

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
        component: EditAppComponent
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
    EditAppComponent,
    NativeAppInfoFormComponent,
    RealmRoleMapperComponent
  ],
  imports: [
    CommonModule,
    DisplayElementsModule,
    InputElementsModule,
    FormElementsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class AppManagerModule { }