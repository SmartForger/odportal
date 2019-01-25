import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import {RouterModule, Routes} from '@angular/router';  

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
    RouterModule.forChild (ROUTES)
  ]
})


export class UiGuideModule { }
