import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import {ListFiltersModule} from '../list-filters/list-filters.module';
import {CustomPipesModule} from '../custom-pipes/custom-pipes.module';
import {FormElementsModule} from '../form-elements/form-elements.module';
import {InputElementsModule} from '../input-elements/input-elements.module';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { MainComponent } from './main/main.component';
import { ListAllUsersComponent } from './list-all-users/list-all-users.component';
import { ListActiveUsersComponent } from './list-active-users/list-active-users.component';
import { ListPendingUsersComponent } from './list-pending-users/list-pending-users.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { RealmRolePickerComponent } from './realm-role-picker/realm-role-picker.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditBasicInfoComponent } from './edit-basic-info/edit-basic-info.component';
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { EditRolesComponent } from './edit-roles/edit-roles.component';
import { ViewAttributesComponent } from './view-attributes/view-attributes.component';
import { EditAttributesComponent } from './edit-attributes/edit-attributes.component';
import { CustomAttributeFormComponent } from './custom-attribute-form/custom-attribute-form.component';
import { CreateUserFormComponent } from './create-user-form/create-user-form.component';
import { ListAppsComponent } from './list-apps/list-apps.component';
import { LoginEventsComponent } from './login-events/login-events.component';

import {MaterialModule} from '../../material.module';
import { UserCardComponent } from './user-card/user-card.component';
import { NgUserManagerComponent } from './ng-user-manager/ng-user-manager.component';
import { NgAppHeaderComponent } from './ng-app-header/ng-app-header.component';
import { NgSelectMenuComponent } from './ng-select-menu/ng-select-menu.component';
import { NgPageTabsComponent } from './ng-page-tabs/ng-page-tabs.component';
import { NgPageSidebarComponent } from './ng-page-sidebar/ng-page-sidebar.component';
import { NgPersonalInformationComponent } from './ng-personal-information/ng-personal-information.component';
import { NgSecurityAccessComponent } from './ng-security-access/ng-security-access.component';
import { NgSimpleTableComponent } from './ng-simple-table/ng-simple-table.component';
import { NgAffiliationsComponent } from './ng-affiliations/ng-affiliations.component';
import { NgCustomAttributesComponent } from './ng-custom-attributes/ng-custom-attributes.component';
import { NgMicroappsComponent } from './ng-microapps/ng-microapps.component';
import { NgMattermostComponent } from './ng-mattermost/ng-mattermost.component';
import { NgJiraSettingsComponent } from './ng-jira-settings/ng-jira-settings.component';
import { NgChipsAutocompleteComponent } from './ng-chips-autocomplete/ng-chips-autocomplete.component';
import { NgRoleMappingsComponent } from './ng-role-mappings/ng-role-mappings.component';
import { NgCertificationsComponent } from './ng-certifications/ng-certifications.component';
import { NgCeusComponent } from './ng-ceus/ng-ceus.component';
import { NgSimspaceComponent } from './ng-simspace/ng-simspace.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'list',
        component: ListUsersComponent
      },
      {
        path: 'edit/:id',
        component: EditUserComponent
      },
      {
        path: 'edit1/:id',
        component: NgUserManagerComponent
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
    ListAllUsersComponent,
    ListActiveUsersComponent,
    ListPendingUsersComponent,
    ListUsersComponent,
    RealmRolePickerComponent,
    EditUserComponent,
    EditBasicInfoComponent,
    EditPasswordComponent,
    EditRolesComponent,
    ViewAttributesComponent,
    EditAttributesComponent,
    CustomAttributeFormComponent,
    CreateUserFormComponent,
    ListAppsComponent,
    LoginEventsComponent,
    UserCardComponent,
    NgUserManagerComponent,
    NgAppHeaderComponent,
    NgSelectMenuComponent,
    NgPageTabsComponent,
    NgPageSidebarComponent,
    NgPersonalInformationComponent,
    NgSecurityAccessComponent,
    NgSimpleTableComponent,
    NgAffiliationsComponent,
    NgCustomAttributesComponent,
    NgMicroappsComponent,
    NgMattermostComponent,
    NgJiraSettingsComponent,
    NgChipsAutocompleteComponent,
    NgRoleMappingsComponent,
    NgCertificationsComponent,
    NgCeusComponent,
    NgSimspaceComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DisplayElementsModule,
    ListFiltersModule,
    CustomPipesModule,
    FormElementsModule,
    InputElementsModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(ROUTES),
    NgCircleProgressModule.forRoot({
      backgroundPadding: 0,
      radius: 15,
      space: -5,
      outerStrokeWidth: 5,
      innerStrokeWidth: 5,
      outerStrokeLinecap: "square",
      innerStrokeColor: "#ccc",
      titleFontSize: "14",
      titleFontWeight: "600",
      subtitleFontSize: "14",
      subtitleFontWeight: "600",
      animation: false,
      showSubtitle: false,
      showUnits: false
    })
  ],
  entryComponents: [
    ViewAttributesComponent, 
    CustomAttributeFormComponent, 
    CreateUserFormComponent,
    RealmRolePickerComponent
  ]
})
export class UserManagerModule { }
