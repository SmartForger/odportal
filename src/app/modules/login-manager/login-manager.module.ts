import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from 'src/app/material.module';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { LoginManagerComponent } from './login-manager/login-manager.component';
import { EnvironmentsListComponent } from './environments-list/environments-list.component';
import { ListAllEnvironmentsComponent } from './list-all-environments/list-all-environments.component';
import { EditEnvironmentComponent } from './edit-environment/edit-environment.component';


const ROUTES: Routes = [
  {
    path: '',
    component: LoginManagerComponent,
    children: [
      {
        path: 'list',
        component: EnvironmentsListComponent
      },
      {
        path: 'edit/:id',
        component: EditEnvironmentComponent
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
    LoginManagerComponent,
    EnvironmentsListComponent,
    ListAllEnvironmentsComponent,
    EditEnvironmentComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DisplayElementsModule,
    FlexLayoutModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class LoginManagerModule { }
