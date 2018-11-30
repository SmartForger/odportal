import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
  	path: 'portal',
  	loadChildren: './modules/portal/portal.module#PortalModule'
  },
  {
    path: 'bootstrapper',
    loadChildren: './modules/bootstrapper/bootstrapper.module#BootstrapperModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
