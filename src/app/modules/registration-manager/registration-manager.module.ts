import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// Modules
import { MaterialModule } from '../../material.module';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { ListFiltersModule } from '../list-filters/list-filters.module';

// Components
import { MainComponent } from './main/main.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { FormDetailsComponent } from './form-details/form-details.component';
import { ListComponent } from './list/list.component';
import { UsersTableComponent } from './users-table/users-table.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ListComponent
      },
      {
        path: 'users/:id',
        component: UserDetailsComponent
      },
      {
        path: 'forms/:id',
        component: FormDetailsComponent
      }
    ]
  }
];

@NgModule({
  declarations: [MainComponent, UserDetailsComponent, FormDetailsComponent, ListComponent, UsersTableComponent],
  imports: [
    CommonModule,
    DisplayElementsModule,
    ListFiltersModule,
    MaterialModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class RegistrationManagerModule { }
