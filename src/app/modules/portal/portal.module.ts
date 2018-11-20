import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarLogoComponent } from './sidebar-logo/sidebar-logo.component';
import { SidebarRolesComponent } from './sidebar-roles/sidebar-roles.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { SidebarUserComponent } from './sidebar-user/sidebar-user.component';
import { SidebarWidgetsComponent } from './sidebar-widgets/sidebar-widgets.component';

const ROUTES: Routes = [
  {
  	path: '',
  	component: MainComponent
  }	
];

@NgModule({
  declarations: [MainComponent, FooterComponent, SidebarLogoComponent, SidebarRolesComponent, SidebarMenuComponent, SidebarUserComponent, SidebarWidgetsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class PortalModule { }