import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// Modules
import { MaterialModule } from '../../material.module';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { ListFiltersModule } from '../list-filters/list-filters.module';
import { CustomPipesModule } from '../custom-pipes/custom-pipes.module';
import { UtcDatePipe } from '../custom-pipes/utc-date.pipe';
import { RegistrationComponentsModule } from '../registration-components/registration-components.module';

// Components
import { MainComponent } from './main/main.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ListComponent } from './list/list.component';

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
      }
    ]
  }
];

@NgModule({
  providers: [
    UtcDatePipe
  ],
  declarations: [
    MainComponent, 
    UserDetailsComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    DisplayElementsModule,
    ListFiltersModule,
    MaterialModule,
    CustomPipesModule,
    RegistrationComponentsModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class RegistrationManagerModule { }