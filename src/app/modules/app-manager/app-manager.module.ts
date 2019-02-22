import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DisplayElementsModule} from '../display-elements/display-elements.module';
import {InputElementsModule} from '../input-elements/input-elements.module';
import {AppInfoModule} from '../app-info/app-info.module';
import {AppRenderersModule} from '../app-renderers/app-renderers.module';

import { MainComponent } from './main/main.component';
import { ListAppsComponent } from './list-apps/list-apps.component';
import { EditAppComponent } from './edit-app/edit-app.component';
import { ListNativeAppsComponent } from './list-native-apps/list-native-apps.component';
import { ListApprovedAppsComponent } from './list-approved-apps/list-approved-apps.component';
import { ListPendingAppsComponent } from './list-pending-apps/list-pending-apps.component';
import { WidgetPreviewerComponent } from './widget-previewer/widget-previewer.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'list',
        component: ListAppsComponent
      },
      {
        path: 'edit/:id',
        component: EditAppComponent
      },
      {
        path: '',
        redirectTo: 'list'
      }
    ]
  }
];

@NgModule({
  declarations: [
    MainComponent,
    ListAppsComponent,
    EditAppComponent,
    ListNativeAppsComponent,
    ListApprovedAppsComponent,
    ListPendingAppsComponent,
    WidgetPreviewerComponent
  ],
  imports: [
    CommonModule,
    DisplayElementsModule,
    InputElementsModule,
    AppInfoModule,
    AppRenderersModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class AppManagerModule { }