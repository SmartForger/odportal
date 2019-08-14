import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormElementsModule } from '../form-elements/form-elements.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRenderersModule } from '../app-renderers/app-renderers.module';
import { AngularDraggableModule } from 'angular2-draggable';
import {DisplayElementsModule} from '../display-elements/display-elements.module';
import {BarRatingModule} from 'ngx-bar-rating';
import {CustomPipesModule} from '../custom-pipes/custom-pipes.module';

import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarLogoComponent } from './sidebar-logo/sidebar-logo.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { SidebarUserComponent } from './sidebar-user/sidebar-user.component';
import { SidebarWidgetsComponent } from './sidebar-widgets/sidebar-widgets.component';
import { AppViewerComponent } from './app-viewer/app-viewer.component';

import { NativeAppGuard } from '../../route-guards/native-app.guard';
import {DashboardGuard} from '../../route-guards/dashboard.guard';

import { WidgetModalComponent } from './widget-modal/widget-modal.component';
import { WidgetWindowsComponent } from './widget-windows/widget-windows.component';

import { MaterialModule } from '../../material.module';
import { FeedbackComponent } from './feedback/feedback.component';
import { WidgetDetailsComponent } from './widget-details/widget-details.component';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';


const ROUTES: Routes = [
  {
  	path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: '../dashboard/dashboard.module#DashboardModule',
        canLoad: [DashboardGuard]
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
        path: 'app-deployment',
        loadChildren: '../app-deployment/app-deployment.module#AppDeploymentModule',
        canActivate: [NativeAppGuard]
      },
      {
        path: 'vendor-manager',
        loadChildren: '../vendor-manager/vendor-manager.module#VendorManagerModule',
        canActivate: [NativeAppGuard]
      },
      {
        path: 'feedback-manager',
        loadChildren: '../feedback-manager/feedback-manager.module#FeedbackManagerModule',
        canActivate: [NativeAppGuard]
      },
      {
        path: 'user-session-tracking',
        loadChildren: '../user-session-tracking/user-session-tracking.module#UserSessionTrackingModule',
        canActivate: [NativeAppGuard]
      },
      {
        path: 'profile',
        loadChildren: '../user-profile/user-profile.module#UserProfileModule',
      },
      {
        path: 'registration',
        loadChildren: '../registration-manager/registration-manager.module#RegistrationManagerModule'
      },
      {
        path: 'my-registration',
        loadChildren: '../my-registration/my-registration.module#MyRegistrationModule'
      },
      {
        path: 'verification',
        loadChildren: '../verification-manager/verification-manager.module#VerificationManagerModule'
      },
      {
        path: 'app/:id',
        component: AppViewerComponent
      },
      {
        path: 'notification-manager',
        loadChildren: '../notification-manager/notification-manager.module#NotificationManagerModule'
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
    AppViewerComponent,
    WidgetModalComponent,
    WidgetWindowsComponent,
    FeedbackComponent,
    WidgetDetailsComponent,
    NotificationModalComponent
  ],

  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    FormElementsModule,
    ReactiveFormsModule,
    AppRenderersModule,
    MaterialModule,
    AngularDraggableModule,
    DisplayElementsModule,
    BarRatingModule,
    FormsModule,
    CustomPipesModule
  ],
  
  entryComponents: [WidgetModalComponent]
})
export class PortalModule { }