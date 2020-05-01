import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LoginGuard} from './route-guards/login.guard';

const routes: Routes = [
  {
  	path: 'portal',
    loadChildren: './modules/portal/portal.module#PortalModule',
    canLoad: [LoginGuard]
  },
  {
    path: 'casting',
    loadChildren: './modules/casting/casting.module#CastingModule'
  },
  {
    path: '',
    loadChildren: './modules/registration-landing/registration-landing.module#RegistrationLandingModule'
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
