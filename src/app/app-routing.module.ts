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
    path: '',
    loadChildren: './modules/registration-landing/registration-landing.module#RegistrationLandingModule'
  },
  {
    path: 'support',
    loadChildren: './modules/support/support.module#SupportModule'
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
