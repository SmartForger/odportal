import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LoginGuard} from './route-guards/login.guard';

const routes: Routes = [
  {
  	path: 'portal',
    loadChildren: './modules/portal/portal.module#PortalModule',
    canActivate: [LoginGuard]
  },
  {
    path: 'registration',
    loadChildren: './modules/registration-landing/registration-landing.module#RegistrationLandingModule'
  },
  {
    path: '**',
    redirectTo: '/registration'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
