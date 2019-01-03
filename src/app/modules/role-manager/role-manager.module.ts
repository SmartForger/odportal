import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { RouterModule, Routes } from '@angular/router';
import {FormElementsModule} from '../form-elements/form-elements.module';
import {ListFiltersModule} from '../list-filters/list-filters.module';
import {CustomPipesModule} from '../custom-pipes/custom-pipes.module';
import {InputElementsModule} from '../input-elements/input-elements.module';

import { MainComponent } from './main/main.component';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { ClientRolePickerComponent } from './client-role-picker/client-role-picker.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { RealmRolePickerComponent } from './realm-role-picker/realm-role-picker.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'list',
        component: ListRolesComponent
      },
      {
        path: 'edit/:id',
        component: EditRoleComponent
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
    ListRolesComponent, 
    EditRoleComponent, 
    RoleFormComponent, 
    ClientRolePickerComponent, 
    ViewUsersComponent, RealmRolePickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DisplayElementsModule,
    FormElementsModule,
    ListFiltersModule,
    CustomPipesModule,
    InputElementsModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class RoleManagerModule { }
