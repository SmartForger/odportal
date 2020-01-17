import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { InputElementsModule } from '../input-elements/input-elements.module';
import { AppInfoModule } from '../app-info/app-info.module';
import { AppRenderersModule } from '../app-renderers/app-renderers.module';
import { ListFiltersModule } from '../list-filters/list-filters.module';
import { FormElementsModule } from '../form-elements/form-elements.module';

import { MainComponent } from './main/main.component';
import { ListAppsComponent } from './list-apps/list-apps.component';
import { EditAppComponent } from './edit-app/edit-app.component';
import { ListNativeAppsComponent } from './list-native-apps/list-native-apps.component';
import { ListApprovedAppsComponent } from './list-approved-apps/list-approved-apps.component';
import { ListPendingAppsComponent } from './list-pending-apps/list-pending-apps.component';
import { RoleMapperComponent } from './role-mapper/role-mapper.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import { SandboxWidgetListComponent } from './sandbox-widget-list/sandbox-widget-list.component';
import { SandboxHttpRequestTrackerComponent } from './sandbox-http-request-tracker/sandbox-http-request-tracker.component';

import { MaterialModule } from '../../material.module';
import { PermissionsModalComponent } from '../display-elements/permissions-modal/permissions-modal.component';
import { SharedRequestsTabComponent } from './shared-requests-tab/shared-requests-tab.component';
import { SharedRequestCardComponent } from './shared-request-card/shared-request-card.component';
import { AppPickerModalComponent } from './app-picker-modal/app-picker-modal.component';
import { DirectivesModule } from '../../directives/directives.module';
import { RoleMappingModalComponent } from './role-mapping-modal/role-mapping-modal.component';
import { ListThirdPartyAppsComponent } from './list-third-party-apps/list-third-party-apps.component';
import { ListAllAppsComponent } from './list-all-apps/list-all-apps.component';

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
        path: 'test/:id',
        component: SandboxComponent
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
    RoleMapperComponent,
    SandboxComponent,
    SandboxWidgetListComponent,
    SandboxHttpRequestTrackerComponent,
    SharedRequestsTabComponent,
    SharedRequestCardComponent,
    AppPickerModalComponent,
    RoleMappingModalComponent,
    ListThirdPartyAppsComponent,
    ListAllAppsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DisplayElementsModule,
    InputElementsModule,
    FormElementsModule,
    AppInfoModule,
    FlexLayoutModule,
    MaterialModule,
    AppRenderersModule,
    ListFiltersModule,
    FormsModule,
    DirectivesModule,
    RouterModule.forChild(ROUTES)
  ],
  entryComponents: [
    PermissionsModalComponent,
    AppPickerModalComponent,
    RoleMappingModalComponent
  ]
})
export class AppManagerModule { }