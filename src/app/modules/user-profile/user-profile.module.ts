//Libraries
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { Routes } from "@angular/router";

//Modules
import { DisplayElementsModule } from "../display-elements/display-elements.module";
import { FormElementsModule } from "../form-elements/form-elements.module";
import { MaterialModule } from "../../material.module";
import { UserManagerModule } from '../user-manager/user-manager.module';
import { OdysseusModule } from '../odysseus/odysseus.module';
import { UserProfileRoutingModule } from './user-profile-routing.module';

//Components
import { AffiliationsComponent } from "../user-manager/affiliations/affiliations.component";
import { AssignRolesDialogComponent } from "../user-manager/assign-roles-dialog/assign-roles-dialog.component";
import { ProfileComponent } from "./profile/profile.component";
import { PersonalInformationComponent } from "../user-manager/personal-information/personal-information.component";
import { RoleMappingsComponent } from "../user-manager/role-mappings/role-mappings.component";
import { SecurityAndAccessComponent } from "../user-manager/security-and-access/security-and-access.component";

const PROFILE_ROUTES: Routes = [
    {
        path: "",
        component: ProfileComponent,
        children: [
            {
                path: 'asdf',
                component: ProfileComponent
            },
            {
                path: '',
                redirectTo: 'asdf'
            }
        ]
    }
];

@NgModule({
    declarations: [
        ProfileComponent
    ],
    imports: [
        UserProfileRoutingModule,
        CommonModule,
        ReactiveFormsModule,
        DisplayElementsModule,
        FormElementsModule,
        MaterialModule,
        OdysseusModule,
        UserManagerModule
    ],
    entryComponents: [
        AffiliationsComponent,
        AssignRolesDialogComponent,
        PersonalInformationComponent,
        RoleMappingsComponent,
        SecurityAndAccessComponent
    ]
})
export class UserProfileModule { }