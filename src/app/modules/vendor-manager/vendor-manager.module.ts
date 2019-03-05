import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from  '@angular/forms';
import {DisplayElementsModule} from '../display-elements/display-elements.module';

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
    FormsModule,
    ReactiveFormsModule,
    DisplayElementsModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class VendorManagerModule { }
