import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// Modules
import { MaterialModule } from '../../material.module';

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
    MaterialModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class RegistrationManagerModule { }
