import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

const USER_MANAGER_ROUTES: Routes = [
    {
        path: '',
        component: MainComponent,
    }
];

@NgModule({
    declarations: [
        MainComponent,
        PersonalInformationComponent,
        UserManagerComponent,
        SecurityAndAccessComponent,
        AffiliationsComponent,
        RoleMappingsComponent
    ],
    imports: [
        CommonModule,
        DisplayElementsModule,
        FormsModule,
        MaterialModule,
        OdysseusModule,
        RouterModule.forChild(USER_MANAGER_ROUTES)
    ],
    entryComponents: [
        AffiliationsComponent,
        PersonalInformationComponent,
        RoleMappingsComponent,
        SecurityAndAccessComponent
    ]
})
export class UserManagerModule { }
