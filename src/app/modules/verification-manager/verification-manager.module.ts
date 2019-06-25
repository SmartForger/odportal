import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// Modules
import { MaterialModule } from '../../material.module';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { CustomPipesModule } from '../custom-pipes/custom-pipes.module';
import { UtcDatePipe } from '../custom-pipes/utc-date.pipe';
import { RegistrationComponentsModule } from '../registration-components/registration-components.module';

// Components
import { MainComponent } from './main/main.component';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';

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
        component: DetailsComponent
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
    ListComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    DisplayElementsModule,
    MaterialModule,
    CustomPipesModule,
    RegistrationComponentsModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class VerificationManagerModule {}
