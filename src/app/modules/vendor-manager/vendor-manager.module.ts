import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from  '@angular/forms';
import {DisplayElementsModule} from '../display-elements/display-elements.module';

import { MainComponent } from './main/main.component';
import { ListVendorsComponent } from './list-vendors/list-vendors.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'list',
        component: ListVendorsComponent
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
    ListVendorsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DisplayElementsModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class VendorManagerModule { }
