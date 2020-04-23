import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './main/main.component';
import { OdysseusModule } from '../odysseus/odysseus.module';
import { Routes, RouterModule } from '@angular/router';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { MaterialModule } from '../../material.module';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { SecurityAndAccessComponent } from './security-and-access/security-and-access.component';
import { AffiliationsComponent } from './affiliations/affiliations.component';
import { RoleMappingsComponent } from './role-mappings/role-mappings.component';
import { FormValidatorsModule } from '../form-validators/form-validators.module';
import { ListUsersComponent } from './list-users/list-users.component';
import { ListActiveUsersComponent } from './list-active-users/list-active-users.component';
import { ListAllUsersComponent } from './list-all-users/list-all-users.component';
import { ListPendingUsersComponent } from './list-pending-users/list-pending-users.component';
import { CreateUserFormComponent } from './create-user-form/create-user-form.component';
import { FormElementsModule } from '../form-elements/form-elements.module';
import { ViewAttributesComponent } from './view-attributes/view-attributes.component';
import { AssignRolesDialogComponent } from './assign-roles-dialog/assign-roles-dialog.component';
import { RealmRolePickerComponent } from './realm-role-picker/realm-role-picker.component';
import { InputElementsModule } from '../input-elements/input-elements.module';
import { UserCardComponent } from './user-card/user-card.component';
import { AvatarModule } from 'ngx-avatar';

const USER_MANAGER_ROUTES: Routes = [
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
                component: UserManagerComponent
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
        AffiliationsComponent,
        AssignRolesDialogComponent,
        CreateUserFormComponent,
        ListActiveUsersComponent,
        ListAllUsersComponent,
        ListPendingUsersComponent,
        ListUsersComponent,
        MainComponent,
        PersonalInformationComponent,
        RealmRolePickerComponent,
        RoleMappingsComponent,
        SecurityAndAccessComponent,
        UserCardComponent,
        UserManagerComponent,
        ViewAttributesComponent
    ],
    imports: [
        AvatarModule,
        CommonModule,
        DisplayElementsModule,
        FormElementsModule,
        FormsModule,
        FormValidatorsModule,
        InputElementsModule,
        MaterialModule,
        OdysseusModule,
        ReactiveFormsModule,
        RouterModule.forChild(USER_MANAGER_ROUTES)
    ],
    exports: [
        AffiliationsComponent,
        AssignRolesDialogComponent,
        PersonalInformationComponent,
        RoleMappingsComponent,
        SecurityAndAccessComponent
    ],
    entryComponents: [
        AffiliationsComponent,
        AssignRolesDialogComponent,
        PersonalInformationComponent,
        RoleMappingsComponent,
        SecurityAndAccessComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class UserManagerModule { }
