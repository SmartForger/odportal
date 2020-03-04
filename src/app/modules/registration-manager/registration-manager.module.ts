import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Modules
import { CustomPipesModule } from '../custom-pipes/custom-pipes.module';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormElementsModule } from '../form-elements/form-elements.module';
import { FormValidatorsModule } from '../form-validators/form-validators.module';
import { ListFiltersModule } from '../list-filters/list-filters.module';
import { MaterialModule } from '../../material.module';
import { RegistrationComponentsModule } from '../registration-components/registration-components.module';
import { UtcDatePipe } from '../custom-pipes/utc-date.pipe';

// Components
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditWorkflowComponent } from './edit-workflow/edit-workflow.component';
import { ListComponent } from './list/list.component';
import { MainComponent } from './main/main.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { NewRegistrationComponent } from './new-registration/new-registration.component';

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
        path: 'workflows/:id',
        component: EditWorkflowComponent
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
    ListComponent,
    EditWorkflowComponent,
    EditUserComponent,
    NewRegistrationComponent
  ],
  imports: [
    CommonModule,
    CustomPipesModule,
    DisplayElementsModule,
    FlexLayoutModule,
    FormElementsModule,
    FormValidatorsModule,
    ListFiltersModule,
    MaterialModule,
    RegistrationComponentsModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class RegistrationManagerModule { }
