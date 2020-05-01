import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CastingComponent } from './casting.component';

const ROUTES: Routes = [
  {
    path: '',
    component: CastingComponent
  }
];

@NgModule({
  declarations: [ CastingComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class CastingModule { }
