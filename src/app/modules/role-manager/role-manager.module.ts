import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { ConfigFormsModule } from '../config-forms/config-forms.module';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { EditRoleComponent } from './edit-role/edit-role.component';

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
        path: 'edit',
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
  declarations: [MainComponent, ListRolesComponent, EditRoleComponent],
  imports: [
    CommonModule,
    DisplayElementsModule,
    ConfigFormsModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class RoleManagerModule { }
