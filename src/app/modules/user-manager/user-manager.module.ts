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
import { ListActiveUsersComponent } from './list-active-users/list-active-users.component';
import { ListPendingUsersComponent } from './list-pending-users/list-pending-users.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { RealmRolePickerComponent } from './realm-role-picker/realm-role-picker.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditBasicInfoComponent } from './edit-basic-info/edit-basic-info.component';
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { EditRolesComponent } from './edit-roles/edit-roles.component';
import { ViewAttributesComponent } from './view-attributes/view-attributes.component';
import { EditAttributesComponent } from './edit-attributes/edit-attributes.component';
import { CustomAttributeFormComponent } from './custom-attribute-form/custom-attribute-form.component';
import { CreateUserFormComponent } from './create-user-form/create-user-form.component';
import { ListAppsComponent } from './list-apps/list-apps.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'list',
        component: ListUsersComponent
      },
      {
        path: 'edit/:id',
        component: EditUserComponent
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
    ListActiveUsersComponent,
    ListPendingUsersComponent,
    ListUsersComponent,
    RealmRolePickerComponent,
    EditUserComponent,
    EditBasicInfoComponent,
    EditPasswordComponent,
    EditRolesComponent,
    ViewAttributesComponent,
    EditAttributesComponent,
    CustomAttributeFormComponent,
    CreateUserFormComponent,
    ListAppsComponent
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
    RouterModule.forChild(ROUTES)
  ]
})
export class UserManagerModule { }
