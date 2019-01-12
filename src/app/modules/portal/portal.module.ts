import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {FormElementsModule} from '../form-elements/form-elements.module';
import {ReactiveFormsModule} from '@angular/forms';

import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarLogoComponent } from './sidebar-logo/sidebar-logo.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { SidebarUserComponent } from './sidebar-user/sidebar-user.component';
import { SidebarWidgetsComponent } from './sidebar-widgets/sidebar-widgets.component';
import { SidebarRoleDockComponent } from './sidebar-role-dock/sidebar-role-dock.component';
import { SidebarWidgetDockComponent } from './sidebar-widget-dock/sidebar-widget-dock.component';

import {NativeAppGuard} from '../../route-guards/native-app.guard';


const ROUTES: Routes = [
  {
  	path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: '../dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'role-manager',
        loadChildren: '../role-manager/role-manager.module#RoleManagerModule',
        canActivate: [NativeAppGuard]
      },
      {
        path: 'user-manager',
        loadChildren: '../user-manager/user-manager.module#UserManagerModule',
        canActivate: [NativeAppGuard]
      },
      {
        path: 'app-manager',
        loadChildren: '../app-manager/app-manager.module#AppManagerModule',
        canActivate: [NativeAppGuard]
      },
      {
        path: '',
        redirectTo: 'dashboard'
      }
    ]
  }	
];

@NgModule({
  declarations: [
    MainComponent, 
    FooterComponent, 
    SidebarLogoComponent, 
    SidebarMenuComponent, 
    SidebarUserComponent, 
    SidebarWidgetsComponent, 
    SidebarRoleDockComponent, 
    SidebarWidgetDockComponent
  ],

  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    FormElementsModule,
    ReactiveFormsModule
  ]
})
export class PortalModule { }