import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { OdysseusModule } from '../odysseus/odysseus.module';
import { Routes, RouterModule } from '@angular/router';
import { DisplayElementsModule } from '../display-elements/display-elements.module';

const USER_MANAGER_ROUTES: Routes = [
    {
        path: '',
        component: MainComponent,
    }
];

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    DisplayElementsModule,
    OdysseusModule,
    RouterModule.forChild(USER_MANAGER_ROUTES)
  ]
})
export class UserManagerModule { }
