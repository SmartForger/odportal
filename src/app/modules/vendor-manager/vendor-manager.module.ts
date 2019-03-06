import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from  '@angular/forms';
import {DisplayElementsModule} from '../display-elements/display-elements.module';
import {FormElementsModule} from '../form-elements/form-elements.module';

import { MainComponent } from './main/main.component';
import { ListVendorsComponent } from './list-vendors/list-vendors.component';
import { VendorFormComponent } from './vendor-form/vendor-form.component';
import { EditVendorComponent } from './edit-vendor/edit-vendor.component';
import { ViewAppsComponent } from './view-apps/view-apps.component';
import { EditMembersComponent } from './edit-members/edit-members.component';

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
        path: 'edit/:vendorId',
        component: EditVendorComponent
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
    ListVendorsComponent, 
    VendorFormComponent, 
    EditVendorComponent,
    ViewAppsComponent,
    EditMembersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DisplayElementsModule,
    FormElementsModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class VendorManagerModule { }
