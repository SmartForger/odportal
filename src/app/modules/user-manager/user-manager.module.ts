import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { RouterModule, Routes } from '@angular/router';
import {ListFiltersModule} from '../list-filters/list-filters.module';
import {CustomPipesModule} from '../custom-pipes/custom-pipes.module';

import { MainComponent } from './main/main.component';
import { ListActiveUsersComponent } from './list-active-users/list-active-users.component';
import { ListPendingUsersComponent } from './list-pending-users/list-pending-users.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { RealmRolePickerComponent } from './realm-role-picker/realm-role-picker.component';

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
    RealmRolePickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DisplayElementsModule,
    ListFiltersModule,
    CustomPipesModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class UserManagerModule { }
