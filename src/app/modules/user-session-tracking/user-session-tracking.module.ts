import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { MaterialModule } from '../../material.module';

import { MainComponent } from './main/main.component';
import { LoginEventsComponent } from './login-events/login-events.component';
import { AdminEventsComponent } from './admin-events/admin-events.component';
import { SessionTrackingConfigComponent } from './session-tracking-config/session-tracking-config.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent
  }
];

@NgModule({
  declarations: [
    MainComponent,
    LoginEventsComponent,
    AdminEventsComponent,
    SessionTrackingConfigComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DisplayElementsModule,
    MaterialModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class UserSessionTrackingModule { }
