import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router'; 

// Modules
import { MaterialModule } from '../../material.module';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { RegistrationComponentsModule } from '../registration-components/registration-components.module';
import { FormElementsModule } from '../form-elements/form-elements.module';

// Components
import { MainComponent } from './main/main.component';


const ROUTES: Routes = [
{
path: '',
component: MainComponent
}
];

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    DisplayElementsModule,
    MaterialModule,
    RegistrationComponentsModule,
    FormElementsModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class SupportModule { }
